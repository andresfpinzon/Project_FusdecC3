package com.example.kotlinsql.services

import com.example.kotlinsql.dto.ComandoCreateRequest
import com.example.kotlinsql.dto.ComandoUpdateRequest
import com.example.kotlinsql.model.Comando
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class ComandoService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Comando> { rs, _ ->
        Comando(
            id = rs.getInt("id"),
            nombreComando = rs.getString("nombre_comando"),
            ubicacionComando = rs.getString("ubicacion_comando"),
            estadoComando = rs.getBoolean("estado_comando"),
            fundacionId = rs.getInt("fundacion_id")
        )
    }

    fun obtenerTodos(): List<Comando> {
        return jdbcTemplate.query("SELECT * FROM comando", rowMapper)
    }

    fun obtenerPorId(id: Int): Comando? {
        val sql = "SELECT * FROM comando WHERE id = ?"
        return jdbcTemplate.query(sql, rowMapper, id).firstOrNull()
    }

    fun crear(request: ComandoCreateRequest): Comando? {
        val sql = """
        INSERT INTO comando (nombre_comando, ubicacion_comando, fundacion_id)
        VALUES (?, ?, ?)
        RETURNING *
        """.trimIndent()
        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            request.nombreComando,
            request.ubicacionComando,
            request.fundacionId
        )
    }

    fun actualizar(id: Int, request: ComandoUpdateRequest): Comando? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombreComando?.let { campos.add("nombre_comando = ?"); valores.add(it) }
        request.ubicacionComando?.let { campos.add("ubicacion_comando = ?"); valores.add(it) }
        request.estadoComando?.let { campos.add("estado_comando = ?"); valores.add(it) }
        request.fundacionId?.let { campos.add("fundacion_id = ?"); valores.add(it) } // Añade esta línea

        if (campos.isEmpty()) return null

        val sqlUpdate = "UPDATE comando SET ${campos.joinToString(", ")} WHERE id = ?"
        valores.add(id)
        jdbcTemplate.update(sqlUpdate, *valores.toTypedArray())

        return jdbcTemplate.queryForObject("SELECT * FROM comando WHERE id = ?", rowMapper, id)
    }

    fun eliminar(id: Int): Int {
        return jdbcTemplate.update("DELETE FROM comando WHERE id = ?", id)
    }

    fun obtenerNombresBrigadas(comandoId: Int): List<String> {
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