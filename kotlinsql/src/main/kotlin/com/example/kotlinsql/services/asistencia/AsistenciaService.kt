package com.example.kotlinsql.services.asistencia

import com.example.kotlinsql.dto.asistencia.AsistenciaCreateRequest
import com.example.kotlinsql.dto.asistencia.AsistenciaUpdateRequest
import com.example.kotlinsql.model.asistencia.Asistencia
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AsistenciaService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Asistencia> { rs, _ ->
        Asistencia(
            id = rs.getInt("id"),
            titulo = rs.getString("titulo"),
            fecha = rs.getString("fecha"),
            usuarioId = rs.getString("usuario_id"),
            estado = rs.getBoolean("estado"),
            createdAt = rs.getString("created_at")
        )
    }

    fun obtenerTodas(): List<Asistencia> {
        return jdbcTemplate.query("SELECT * FROM asistencia", rowMapper)
    }

    fun crear(request: AsistenciaCreateRequest): Asistencia? {
        val sql = """
        INSERT INTO asistencia (titulo, fecha, usuario_id)
        VALUES (?, ?, ?)
        RETURNING *
    """.trimIndent()
        return jdbcTemplate.queryForObject(sql, rowMapper, request.titulo, request.fecha, request.usuarioId)
    }

    fun actualizar(id: Int, request: AsistenciaUpdateRequest): Asistencia? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.titulo?.let { campos.add("titulo = ?"); valores.add(it) }
        request.fecha?.let { campos.add("fecha = ?"); valores.add(it) }
        request.estado?.let { campos.add("estado = ?"); valores.add(it) }

        if (campos.isEmpty()) return null

        val sqlUpdate = "UPDATE asistencia SET ${campos.joinToString(", ")} WHERE id = ?"
        valores.add(id)
        jdbcTemplate.update(sqlUpdate, *valores.toTypedArray())

        // Devolver la asistencia actualizada
        val sqlSelect = "SELECT * FROM asistencia WHERE id = ?"
        return jdbcTemplate.queryForObject(sqlSelect, rowMapper, id)
    }

    @Transactional
    fun eliminar(id: Int): Int {
        val estudiantes = jdbcTemplate.queryForList(
            "SELECT estudiante_id FROM asistencia_estudiante WHERE asistencia_id = ?",
            String::class.java,
            id
        )

        estudiantes.forEach { estudianteId ->
            jdbcTemplate.update(
                """
            UPDATE estudiante 
            SET 
                asistencias_registradas = asistencias_registradas - 1,
                aprobado = (asistencias_registradas - 1) >= 15
            WHERE numero_documento = ?
            """,
                estudianteId
            )
        }

        return jdbcTemplate.update("DELETE FROM asistencia WHERE id = ?", id)
    }
}
