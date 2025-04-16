package com.example.kotlinsql.services

import com.example.kotlinsql.dto.CalificacionEstudianteCreateRequest
import com.example.kotlinsql.model.CalificacionEstudiante
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class CalificacionEstudianteService {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    val rowMapper = RowMapper<CalificacionEstudiante> { rs, _ ->
        CalificacionEstudiante(
            calificacionId = rs.getInt("calificacion_id"),
            estudianteId = rs.getString("estudiante_id")
        )
    }

    fun obtenerTodos(): List<CalificacionEstudiante> {
        val sql = "SELECT * FROM calificacion_estudiante"
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(request: CalificacionEstudianteCreateRequest): CalificacionEstudiante? {
        val sql = """
            INSERT INTO calificacion_estudiante (calificacion_id, estudiante_id)
            VALUES (?, ?)
            RETURNING *
        """.trimIndent()
        return jdbcTemplate.queryForObject(sql, rowMapper, request.calificacionId, request.estudianteId)
    }

    fun eliminar(calificacionId: Int, estudianteId: String): Int {
        val sql = "DELETE FROM calificacion_estudiante WHERE calificacion_id = ? AND estudiante_id = ?"
        return jdbcTemplate.update(sql, calificacionId, estudianteId)
    }
}
