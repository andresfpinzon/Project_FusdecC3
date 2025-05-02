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
            fundacionNombre = rs.getString("nombre_fundacion"),
            brigadas = obtenerNombresBrigadas(comandoId)
        )
    }

    fun obtenerTodos(): List<ComandoResponse> {
        val sql = """
            SELECT c.*, f.nombre_fundacion
            FROM comando c
            LEFT JOIN fundacion f ON c.fundacion_id = f.id
            WHERE c.estado_comando = true
            ORDER BY c.nombre_comando ASC
        """.trimIndent()
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(request: ComandoCreateRequest): ComandoResponse? {
        val sql = """
            INSERT INTO comando (nombre_comando, ubicacion_comando, estado_comando)
            VALUES (?, ?, true)
            RETURNING *, (SELECT nombre_fundacion FROM fundacion WHERE id = fundacion_id) as nombre_fundacion
        """.trimIndent()

        return jdbcTemplate.queryForObject(sql, rowMapper,
            request.nombreComando,
            request.ubicacionComando
        )
    }

    fun actualizar(id: Int, request: ComandoUpdateRequest): ComandoResponse? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombreComando?.let { campos.add("nombre_comando = ?"); valores.add(it) }
        request.ubicacionComando?.let { campos.add("ubicacion_comando = ?"); valores.add(it) }
        request.estadoComando?.let { campos.add("estado_comando = ?"); valores.add(it) }

        if (campos.isEmpty()) return null

        val sql = """
            UPDATE comando c
            SET ${campos.joinToString(", ")}
            FROM fundacion f
            WHERE c.id = ?
            AND c.estado_comando = true
            AND c.fundacion_id = f.id
            RETURNING c.*, f.nombre_fundacion
        """.trimIndent()

        valores.add(id)
        return jdbcTemplate.queryForObject(sql, rowMapper, *valores.toTypedArray())
    }

    fun obtenerPorId(id: Int): ComandoResponse? {
        val sql = """
            SELECT c.*, f.nombre_fundacion
            FROM comando c
            LEFT JOIN fundacion f ON c.fundacion_id = f.id
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
            UPDATE comando c
            SET estado_comando = false
            FROM fundacion f
            WHERE c.id = ?
            AND c.estado_comando = true
            AND c.fundacion_id = f.id
            RETURNING c.*, f.nombre_fundacion
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun asignarFundacion(comandoId: Int, fundacionId: Int): ComandoResponse? {
        val sql = """
            UPDATE comando c
            SET fundacion_id = ?
            FROM fundacion f
            WHERE c.id = ?
            AND c.estado_comando = true
            AND f.id = ?
            RETURNING c.*, f.nombre_fundacion
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, fundacionId, comandoId, fundacionId)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    private fun obtenerNombresBrigadas(comandoId: Int): List<String> {
        val sql = """
            SELECT nombre_brigada
            FROM brigada
            WHERE comando_id = ?
            AND estado_brigada = true
            ORDER BY nombre_brigada ASC
        """.trimIndent()

        return jdbcTemplate.queryForList(sql, String::class.java, comandoId)
    }
}