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
            comandoNombre = obtenerNombreComando(rs.getInt("comando_id")),
            unidades = obtenerNombresUnidadesPorBrigadaId(brigadaId)
        )
    }

    fun obtenerTodos(): List<BrigadaResponse> {
        val sql = """
            SELECT b.*
            FROM brigada b
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
            RETURNING *
        """.trimIndent()

        val brigada = jdbcTemplate.queryForObject(sql, rowMapper,
            request.nombreBrigada,
            request.ubicacionBrigada,
            comandoId
        )

        request.unidadesNombres?.forEach { nombreUnidad ->
            val updateUnidad = """
                UPDATE unidad
                SET brigada_id = ?
                WHERE nombre_unidad = ?
                AND estado_unidad = true
            """.trimIndent()
            jdbcTemplate.update(updateUnidad, brigada?.id, nombreUnidad)
        }

        return brigada
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
            UPDATE brigada
            SET ${campos.joinToString(", ")}
            WHERE id = ?
            AND estado_brigada = true
            RETURNING *
        """.trimIndent()

        valores.add(id)

        val brigada = jdbcTemplate.queryForObject(sql, rowMapper, *valores.toTypedArray())

        request.unidadesNombres?.let { nombres ->
            // Primero desvinculamos las unidades actuales
            jdbcTemplate.update(
                "UPDATE unidad SET brigada_id = NULL WHERE brigada_id = ?",
                id
            )

            // Luego asignamos las nuevas unidades
            nombres.forEach { nombre ->
                jdbcTemplate.update(
                    "UPDATE unidad SET brigada_id = ? WHERE nombre_unidad = ? AND estado_unidad = true",
                    id, nombre
                )
            }
        }

        return brigada
    }

    fun obtenerPorId(id: Int): BrigadaResponse? {
        val sql = """
            SELECT b.*
            FROM brigada b
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
            UPDATE brigada
            SET estado_brigada = false
            WHERE id = ?
            AND estado_brigada = true
            RETURNING *
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun obtenerNombresUnidadesPorBrigadaId(brigadaId: Int): List<String> {
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

    private fun obtenerNombreComando(comandoId: Int): String {
        val sql = """
            SELECT nombre_comando
            FROM comando
            WHERE id = ?
            AND estado_comando = true
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, String::class.java, comandoId) ?: "Sin comando"
        } catch (e: EmptyResultDataAccessException) {
            "Sin comando"
        }
    }
}