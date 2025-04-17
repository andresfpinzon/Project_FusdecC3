package com.example.kotlinsql.services

import com.example.kotlinsql.dto.EstudianteCreateRequest
import com.example.kotlinsql.dto.EstudianteUpdateRequest
import com.example.kotlinsql.model.Estudiante
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class EstudianteService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Estudiante> { rs, _ ->
        Estudiante(
            numeroDocumento = rs.getString("numero_documento"),
            nombre = rs.getString("nombre"),
            apellido = rs.getString("apellido"),
            tipoDocumento = rs.getString("tipo_documento"),
            genero = rs.getString("genero"),
            unidad = rs.getString("unidad"),
            edicion = rs.getString("edicion"),
            colegio = rs.getString("colegio"),
            grado = rs.getString("grado"),
            estado = rs.getBoolean("estado")
        )
    }

    fun obtenerTodos(): List<Estudiante> {
        val sql = "SELECT * FROM estudiante"
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(request: EstudianteCreateRequest): Estudiante? {
        val sql = """
            INSERT INTO estudiante (
                numero_documento, nombre, apellido, tipo_documento,
                genero, unidad, colegio, edicion, grado
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        """.trimIndent()
        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            request.numeroDocumento,
            request.nombre,
            request.apellido,
            request.tipoDocumento,
            request.genero,
            request.unidad,
            request.colegio,
            request.edicion,
            request.grado
        )
    }

    fun actualizar(documento: String, request: EstudianteUpdateRequest): Estudiante? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombre?.let { campos.add("nombre = ?"); valores.add(it) }
        request.apellido?.let { campos.add("apellido = ?"); valores.add(it) }
        request.tipoDocumento?.let { campos.add("tipo_documento = ?"); valores.add(it) }
        request.genero?.let { campos.add("genero = ?"); valores.add(it) }
        request.unidad?.let { campos.add("unidad = ?"); valores.add(it) }
        request.colegio?.let { campos.add("colegio = ?"); valores.add(it) }
        request.grado?.let { campos.add("grado = ?"); valores.add(it) }
        request.edicion?.let { campos.add("edicion = ?"); valores.add(it) }
        request.estado?.let { campos.add("estado = ?"); valores.add(it) }

        if (campos.isEmpty()) return null

        val sql = "UPDATE estudiante SET ${campos.joinToString(", ")} WHERE numero_documento = ?"
        valores.add(documento)
        jdbcTemplate.update(sql, *valores.toTypedArray())

        val sqlSelect = "SELECT * FROM estudiante WHERE numero_documento = ?"
        return jdbcTemplate.queryForObject(sqlSelect, rowMapper, documento)
    }

    fun eliminar(documento: String): Int {
        val sql = "DELETE FROM estudiante WHERE numero_documento = ?"
        return jdbcTemplate.update(sql, documento)
    }
}