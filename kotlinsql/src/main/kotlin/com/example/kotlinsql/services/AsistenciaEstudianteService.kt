package com.example.kotlinsql.services

import com.example.kotlinsql.dto.AsistenciaEstudianteCreateRequest
import com.example.kotlinsql.model.AsistenciaEstudiante
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class AsistenciaEstudianteService {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    val rowMapper = RowMapper<AsistenciaEstudiante> { rs, _ ->
        AsistenciaEstudiante(
            asistenciaId = rs.getInt("asistencia_id"),
            estudianteId = rs.getString("estudiante_id")
        )
    }

    fun obtenerTodos(): List<AsistenciaEstudiante> {
        val sql = "SELECT * FROM asistencia_estudiante"
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(request: AsistenciaEstudianteCreateRequest): AsistenciaEstudiante? {
        val sql = """
        INSERT INTO asistencia_estudiante (asistencia_id, estudiante_id)
        VALUES (?, ?)
        RETURNING *
    """.trimIndent()
        return jdbcTemplate.queryForObject(sql, rowMapper, request.asistenciaId, request.estudianteId)
    }



    fun eliminar(asistenciaId: Int, estudianteId: String): Int {
        val sql = "DELETE FROM asistencia_estudiante WHERE asistencia_id = ? AND estudiante_id = ?"
        return jdbcTemplate.update(sql, asistenciaId, estudianteId)
    }
}
