package com.example.kotlinsql.services.edicion

import com.example.kotlinsql.dto.EstudianteResumenResponse
import com.example.kotlinsql.dto.edicion.UpdateEdicionDto
import com.example.kotlinsql.model.edicion.Edicion
import com.example.kotlinsql.repositories.edicion.EdicionRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service
import java.time.LocalDate

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

    fun updateEdicion(id: Long, updateDto: UpdateEdicionDto): Edicion? {
        val existingEdicion = edicionRepository.getEdicionById(id) ?: return null

        return existingEdicion.copy(
            titulo = updateDto.titulo ?: existingEdicion.titulo,
            fechaInicio = updateDto.fechaInicio?.let { LocalDate.parse(it) } ?: existingEdicion.fechaInicio,
            fechaFin = updateDto.fechaFin?.let { LocalDate.parse(it) } ?: existingEdicion.fechaFin,
            cursoId = updateDto.cursoId?.toInt() ?: existingEdicion.cursoId
        ).let { edicionRepository.save(it) }
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