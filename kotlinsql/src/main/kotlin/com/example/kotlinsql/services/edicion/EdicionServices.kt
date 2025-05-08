package com.example.kotlinsql.services.edicion

import com.example.kotlinsql.dto.EstudianteResumenResponse
import com.example.kotlinsql.model.edicion.Edicion
import com.example.kotlinsql.repositories.edicion.EdicionRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class EdicionServices (
    private val edicionRepository: EdicionRepository,
    private val jdbcTemplate: JdbcTemplate
) {

    fun getAllEdiciones(): List<Edicion> {
        return edicionRepository.findAll()
    }

    fun getEdicionById(id: Long): Edicion? {
        return edicionRepository.getEdicionById(id)
    }

    fun createEdicion(edicion: Edicion): Edicion {
        val edicion = Edicion(
            titulo = edicion.titulo,
            fechaInicio = edicion.fechaInicio,
            fechaFin = edicion.fechaFin,
        )
        return edicionRepository.save(edicion)
    }

    fun updateEdicion(id: Long, edicion: Edicion): Edicion? {
        val existingEdicion = edicionRepository.getEdicionById(id)
        if (existingEdicion != null) {
            return edicionRepository.save(edicion)
        }
        return null
    }

    fun deleteEdicion(id: Long) {
        edicionRepository.deleteById(id)
    }

    fun obtenerEstudiantesPorEdicion(edicionId: Int): List<EstudianteResumenResponse> {
        val sql = """
            SELECT numero_documento, nombre, apellido 
            FROM estudiante 
            WHERE edicion_id = ? 
            AND estado = true
            ORDER BY nombre ASC
        """.trimIndent()

        return jdbcTemplate.query(sql, { rs, _ ->
            EstudianteResumenResponse(
                numeroDocumento = rs.getString("numero_documento"),
                nombre = rs.getString("nombre"),
                apellido = rs.getString("apellido")
            )
        }, edicionId)
    }
}