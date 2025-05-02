package com.example.kotlinsql.services

import com.example.kotlinsql.dto.CursoCreateRequest
import com.example.kotlinsql.dto.CursoEdicionesRequest
import com.example.kotlinsql.dto.CursoUpdateRequest
import com.example.kotlinsql.model.Curso
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class CursoService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapperResponse = RowMapper<CursoEdicionesRequest> { rs, _ ->
        CursoEdicionesRequest(
            edicionTitulo = rs.getString("edicion_titulo")
        )
    }


    val rowMapper = RowMapper<Curso> { rs, _ ->
        Curso(
            id = rs.getInt("id"),
            nombre = rs.getString("nombre"),
            descripcion = rs.getString("descripcion"),
            intensidadHoraria = rs.getString("intensidad_horaria"),
            fundacionId = rs.getString("fundacion_id"),
            estado = rs.getBoolean("estado")
        )
    }

    fun obtenerTodos(): List<Curso> {
        return jdbcTemplate.query("SELECT * FROM curso", rowMapper)
    }

    fun crear(request: CursoCreateRequest): Curso? {
        val sql = """
        INSERT INTO curso (nombre, descripcion, intensidad_horaria, fundacion_id)
        VALUES (?, ?, ?, ?)
        RETURNING *
    """.trimIndent()
        return jdbcTemplate.queryForObject(sql, rowMapper, request.nombre, request.descripcion, request.intensidadHoraria, request.fundacionId)
    }

    fun actualizar(id: Int, request: CursoUpdateRequest): Curso? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombre?.let { campos.add("nombre = ?"); valores.add(it) }
        request.descripcion?.let { campos.add("descripcion = ?"); valores.add(it) }
        request.intensidadHoraria?.let { campos.add("intensidad_horaria = ?"); valores.add(it) }
        request.estado?.let { campos.add("estado = ?"); valores.add(it) }

        if (campos.isEmpty()) return null

        val sqlUpdate = "UPDATE curso SET ${campos.joinToString(", ")} WHERE id = ?"
        valores.add(id)
        jdbcTemplate.update(sqlUpdate, *valores.toTypedArray())

        // Devolver el curso actualizado
        val sqlSelect = "SELECT * FROM curso WHERE id = ?"
        return jdbcTemplate.queryForObject(sqlSelect, rowMapper, id)
    }

    fun eliminar(id: Int): Int {
        return jdbcTemplate.update("DELETE FROM curso WHERE id = ?", id)
    }

    fun obtenerEdiciones(id: Int): List<CursoEdicionesRequest> {
        val sql = "SELECT titulo as edicion_titulo FROM ediciones WHERE curso_id = ?"
        return jdbcTemplate.query(sql, rowMapperResponse, id)
    }

}