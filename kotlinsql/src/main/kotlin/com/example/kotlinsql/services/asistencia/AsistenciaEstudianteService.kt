package com.example.kotlinsql.services.asistencia

import com.example.kotlinsql.dto.asistencia.AsistenciaEstudianteCreateRequest
import com.example.kotlinsql.model.asistencia.AsistenciaEstudiante
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
        val insertSql = """
            INSERT INTO asistencia_estudiante (asistencia_id, estudiante_id)
            VALUES (?, ?)
            RETURNING *
        """.trimIndent()

        val result = jdbcTemplate.queryForObject(insertSql, rowMapper, request.asistenciaId, request.estudianteId)

        // Incrementar contador y verificar aprobado
        val updateSql = """
            UPDATE estudiante
            SET asistencias_registradas = asistencias_registradas + 1,
                aprobado = CASE 
                    WHEN asistencias_registradas + 1 >= 15 THEN TRUE 
                    ELSE aprobado 
                END
            WHERE numero_documento = ?
        """.trimIndent()

        jdbcTemplate.update(updateSql, request.estudianteId)

        return result
    }

    fun eliminar(asistenciaId: Int, estudianteId: String): Int {
        val deleteSql = "DELETE FROM asistencia_estudiante WHERE asistencia_id = ? AND estudiante_id = ?"
        val rows = jdbcTemplate.update(deleteSql, asistenciaId, estudianteId)

        if (rows > 0) {
            // Decrementar contador y verificar aprobado
            val updateSql = """
                UPDATE estudiante
                SET asistencias_registradas = asistencias_registradas - 1,
                    aprobado = CASE 
                        WHEN asistencias_registradas - 1 < 15 THEN FALSE 
                        ELSE aprobado 
                    END
                WHERE numero_documento = ?
            """.trimIndent()

            jdbcTemplate.update(updateSql, estudianteId)
        }

        return rows
    }
}

