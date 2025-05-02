package com.example.kotlinsql.services

import com.example.kotlinsql.dto.*
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class BrigadaService(private val jdbcTemplate: JdbcTemplate) {

    private val rowMapper = RowMapper<BrigadaResponse> { rs, _ ->
        val brigadaId = rs.getInt("id")
        BrigadaResponse(
            id = brigadaId,
            nombreBrigada = rs.getString("nombre_brigada"),
            ubicacionBrigada = rs.getString("ubicacion_brigada"),
            estadoBrigada = rs.getBoolean("estado_brigada"),
            comandoNombre = rs.getString("nombre_comando"),
            unidades = obtenerUnidadesAsignadas(brigadaId)  // Corregido aquí
        )
    }
    fun obtenerTodos(): List<BrigadaResponse> {
        val sql = """
            SELECT b.*, c.nombre_comando
            FROM brigada b
            LEFT JOIN comando c ON b.comando_id = c.id
            WHERE b.estado_brigada = true
            ORDER BY b.nombre_brigada ASC
        """.trimIndent()

        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(request: BrigadaCreateRequest): BrigadaResponse? {
        val comandoId = obtenerComandoIdPorNombre(request.comandoNombre)

        val sql = """
            INSERT INTO brigada (nombre_brigada, ubicacion_brigada, comando_id, estado_brigada)
            VALUES (?, ?, ?, true)
            RETURNING *, (SELECT nombre_comando FROM comando WHERE id = ?)
        """.trimIndent()

        return jdbcTemplate.queryForObject(sql, rowMapper,
            request.nombreBrigada,
            request.ubicacionBrigada,
            comandoId,
            comandoId
        )
    }

    fun actualizar(id: Int, request: BrigadaUpdateRequest): BrigadaResponse? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombreBrigada?.let { campos.add("nombre_brigada = ?"); valores.add(it) }
        request.ubicacionBrigada?.let { campos.add("ubicacion_brigada = ?"); valores.add(it) }
        request.estadoBrigada?.let { campos.add("estado_brigada = ?"); valores.add(it) }
        request.comandoNombre?.let {
            val comandoId = obtenerComandoIdPorNombre(it)
            if (comandoId != null) {
                campos.add("comando_id = ?")
                valores.add(comandoId)
            }
        }

        if (campos.isEmpty()) return null

        val sql = """
            UPDATE brigada b
            SET ${campos.joinToString(", ")}
            FROM comando c
            WHERE b.id = ?
            AND b.estado_brigada = true
            AND b.comando_id = c.id
            RETURNING b.*, c.nombre_comando
        """.trimIndent()

        valores.add(id)
        return jdbcTemplate.queryForObject(sql, rowMapper, *valores.toTypedArray())
    }

    fun obtenerPorId(id: Int): BrigadaResponse? {
        val sql = """
            SELECT b.*, c.nombre_comando
            FROM brigada b
            LEFT JOIN comando c ON b.comando_id = c.id
            WHERE b.id = ?
            AND b.estado_brigada = true
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun desactivar(id: Int): BrigadaResponse? {
        val sql = """
            UPDATE brigada b
            SET estado_brigada = false
            FROM comando c
            WHERE b.id = ?
            AND b.estado_brigada = true
            AND b.comando_id = c.id
            RETURNING b.*, c.nombre_comando
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun asignarComando(brigadaId: Int, comandoId: Int): BrigadaResponse? {
        val sql = """
            UPDATE brigada b
            SET comando_id = ?
            FROM comando c
            WHERE b.id = ?
            AND b.estado_brigada = true
            AND c.id = ?
            RETURNING b.*, c.nombre_comando
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, comandoId, brigadaId, comandoId)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun obtenerUnidadesAsignadas(brigadaId: Int): List<String> {
        val sql = """
            SELECT nombre_unidad
            FROM unidad
            WHERE brigada_id = ?
            AND estado_unidad = true
            ORDER BY nombre_unidad ASC
        """.trimIndent()

        return jdbcTemplate.queryForList(sql, String::class.java, brigadaId)
    }

    private fun obtenerComandoIdPorNombre(nombreComando: String): Int? {
        val sql = """
            SELECT id FROM comando
            WHERE nombre_comando = ?
            AND estado_comando = true
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, Int::class.java, nombreComando)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }
}
