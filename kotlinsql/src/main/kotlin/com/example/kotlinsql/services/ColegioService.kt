package com.example.kotlinsql.services

import com.example.kotlinsql.dto.ColegioCreateRequest
import com.example.kotlinsql.dto.ColegioUpdateRequest
import com.example.kotlinsql.dto.EstudianteResumenResponse
import com.example.kotlinsql.model.Colegio
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class ColegioService (private val jdbcTemplate: JdbcTemplate){
    val rowMapper = RowMapper<Colegio> { rs, _ ->
        Colegio(
            id = rs.getInt("id"),
            nombre = rs.getString("nombre"),
            email = rs.getString("email"),
            estado = rs.getBoolean("estado")
        )
    }

    fun obtenerTodas(): List<Colegio> {
        return jdbcTemplate.query("SELECT * FROM colegio", rowMapper)
    }

    fun crear(request: ColegioCreateRequest): Colegio? {
        val sql = """
        INSERT INTO colegio (nombre, email)
        VALUES (?, ?)
        RETURNING *
    """.trimIndent()
        return jdbcTemplate.queryForObject(sql, rowMapper, request.nombre, request.email)
    }

    fun actualizar(id: Int, request: ColegioUpdateRequest): Colegio? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombre?.let { campos.add("nombre = ?"); valores.add(it) }
        request.email?.let { campos.add("email = ?"); valores.add(it) }
        request.estado?.let { campos.add("estado = ?"); valores.add(it) }

        if (campos.isEmpty()) return null

        val sqlUpdate = "UPDATE colegio SET ${campos.joinToString(", ")} WHERE id = ?"
        valores.add(id)
        jdbcTemplate.update(sqlUpdate, *valores.toTypedArray())

        // Devolver el colegio actualizado
        val sqlSelect = "SELECT * FROM colegio WHERE id = ?"
        return jdbcTemplate.queryForObject(sqlSelect, rowMapper, id)
    }

    fun eliminar(id: Int): Int {
        return jdbcTemplate.update("DELETE FROM colegio WHERE id = ?", id)
    }

    fun obtenerPorId(id: Int): Colegio? {
        val sql = "SELECT * FROM colegio WHERE id = ?"
        return jdbcTemplate.queryForObject(sql, rowMapper, id)
    }

    fun obtenerEstudiantesPorColegio(colegioId: Int): List<EstudianteResumenResponse> {
        val sql = """
            SELECT numero_documento, nombre, apellido 
            FROM estudiante 
            WHERE colegio_id = ? 
            AND estado = true
            ORDER BY nombre ASC
        """.trimIndent()

        return jdbcTemplate.query(sql, { rs, _ ->
            EstudianteResumenResponse(
                numeroDocumento = rs.getString("numero_documento"),
                nombre = rs.getString("nombre"),
                apellido = rs.getString("apellido")
            )
        }, colegioId)
    }

}