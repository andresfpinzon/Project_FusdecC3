package com.example.kotlinsql.services

import com.example.kotlinsql.dto.*
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class ComandoService(private val jdbcTemplate: JdbcTemplate) {

    private val rowMapper = RowMapper<ComandoResponse> { rs, _ ->
        val comandoId = rs.getInt("id")
        ComandoResponse(
            id = comandoId,
            nombreComando = rs.getString("nombre_comando"),
            estadoComando = rs.getBoolean("estado_comando"),
            ubicacionComando = rs.getString("ubicacion_comando"),
            fundacionNombre = obtenerNombreFundacion(rs.getInt("fundacion_id")),
            brigadas = obtenerNombresBrigadasPorComandoId(comandoId)
        )
    }

    private val brigadaMapper = RowMapper<BrigadaResponse> { rs, _ ->
        BrigadaResponse(
            id = rs.getInt("id"),
            nombreBrigada = rs.getString("nombre_brigada"),
            ubicacionBrigada = rs.getString("ubicacion_brigada"),
            estadoBrigada = rs.getBoolean("estado_brigada"),
            comandoNombre = obtenerNombreComando(rs.getInt("comando_id")),
            unidades = null
        )
    }

    fun obtenerTodos(): List<ComandoResponse> {
        val sql = """
            SELECT c.*
            FROM comando c
            WHERE c.estado_comando = true
            ORDER BY c.nombre_comando ASC
        """.trimIndent()
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(request: ComandoCreateRequest): ComandoResponse? {
        val fundacionId = if (request.fundacionNombre != null)
            obtenerFundacionIdPorNombre(request.fundacionNombre) else null

        val sql = """
            INSERT INTO comando (nombre_comando, ubicacion_comando, fundacion_id, estado_comando)
            VALUES (?, ?, ?, true)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(sql, rowMapper,
            request.nombreComando,
            request.ubicacionComando,
            fundacionId
        )
    }

    fun actualizar(id: Int, request: ComandoUpdateRequest): ComandoResponse? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombreComando?.let { campos.add("nombre_comando = ?"); valores.add(it) }
        request.ubicacionComando?.let { campos.add("ubicacion_comando = ?"); valores.add(it) }
        request.estadoComando?.let { campos.add("estado_comando = ?"); valores.add(it) }
        request.fundacionNombre?.let {
            val fundacionId = obtenerFundacionIdPorNombre(it)
            if (fundacionId != null) {
                campos.add("fundacion_id = ?")
                valores.add(fundacionId)
            }
        }

        if (campos.isEmpty()) return null

        val sql = """
            UPDATE comando
            SET ${campos.joinToString(", ")}
            WHERE id = ?
            AND estado_comando = true
            RETURNING *
        """.trimIndent()

        valores.add(id)

        return jdbcTemplate.queryForObject(sql, rowMapper, *valores.toTypedArray())
    }

    fun asignarFundacion(comandoId: Int, fundacionNombre: String): ComandoResponse? {
        val fundacionId = obtenerFundacionIdPorNombre(fundacionNombre) ?: return null

        val sql = """
            UPDATE comando
            SET fundacion_id = ?
            WHERE id = ?
            AND estado_comando = true
            RETURNING *
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, fundacionId, comandoId)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun obtenerPorId(id: Int): ComandoResponse? {
        val sql = """
            SELECT c.*
            FROM comando c
            WHERE c.id = ?
            AND c.estado_comando = true
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun desactivar(id: Int): ComandoResponse? {
        val sql = """
            UPDATE comando
            SET estado_comando = false
            WHERE id = ?
            AND estado_comando = true
            RETURNING *
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun obtenerBrigadasPorComandoId(comandoId: Int): List<BrigadaResponse> {
        val sql = """
            SELECT b.*
            FROM brigada b
            WHERE b.comando_id = ?
            AND b.estado_brigada = true
            ORDER BY b.nombre_brigada ASC
        """.trimIndent()

        return jdbcTemplate.query(sql, brigadaMapper, comandoId)
    }

    private fun obtenerNombresBrigadasPorComandoId(comandoId: Int): List<String> {
        val sql = """
            SELECT nombre_brigada
            FROM brigada
            WHERE comando_id = ?
            AND estado_brigada = true
            ORDER BY nombre_brigada ASC
        """.trimIndent()

        return jdbcTemplate.queryForList(sql, String::class.java, comandoId)
    }

    private fun obtenerFundacionIdPorNombre(nombreFundacion: String): Int? {
        val sql = """
            SELECT id FROM fundacion
            WHERE nombre_fundacion = ?
            AND estado_fundacion = true
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, Int::class.java, nombreFundacion)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    private fun obtenerNombreFundacion(fundacionId: Int): String? {
        val sql = """
            SELECT nombre_fundacion
            FROM fundacion
            WHERE id = ?
            AND estado_fundacion = true
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, String::class.java, fundacionId)
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