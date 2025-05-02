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
            grado = rs.getString("grado"),
            estado = rs.getBoolean("estado"),
            asistenciasRegistradas = rs.getInt("asistencias_registradas"),
            aprobado = rs.getBoolean("aprobado"),
            unidadId = rs.getInt("unidad_id"),
            colegioId = rs.getInt("colegio_id"),
            edicionId = rs.getInt("edicion_id")

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
                genero, grado, unidad_id, colegio_id, edicion_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            request.grado,
            request.unidadId,
            request.colegioId,
            request.edicionId
        )
    }

    fun actualizar(documento: String, request: EstudianteUpdateRequest): Estudiante? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombre?.let { campos.add("nombre = ?"); valores.add(it) }
        request.apellido?.let { campos.add("apellido = ?"); valores.add(it) }
        request.tipoDocumento?.let { campos.add("tipo_documento = ?"); valores.add(it) }
        request.genero?.let { campos.add("genero = ?"); valores.add(it) }
        request.grado?.let { campos.add("grado = ?"); valores.add(it) }
        request.estado?.let { campos.add("estado = ?"); valores.add(it) }
        request.unidadId?.let { campos.add("unidad_id = ?"); valores.add(it) }
        request.colegioId?.let { campos.add("colegio_id = ?"); valores.add(it) }
        request.edicionId?.let { campos.add("edicion_id = ?"); valores.add(it) }

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
