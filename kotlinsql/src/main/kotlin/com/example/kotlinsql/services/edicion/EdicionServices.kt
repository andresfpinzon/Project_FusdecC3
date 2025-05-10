package com.example.kotlinsql.services.edicion

import com.example.kotlinsql.dto.estudiante.EstudianteResumenResponse
import com.example.kotlinsql.dto.edicion.UpdateEdicionDto
import com.example.kotlinsql.dto.edicion.CreateEdicionDto
import com.example.kotlinsql.model.edicion.Edicion
import com.example.kotlinsql.repositories.edicion.EdicionRepository
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Service
class EdicionServices (
    private val edicionRepository: EdicionRepository,
    private val jdbcTemplate: JdbcTemplate
) {

    private val dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

    fun getAllEdiciones(): List<Edicion> {
        return edicionRepository.findAll()
    }

    fun getEdicionById(id: Long): Edicion? {
        return edicionRepository.getEdicionById(id)
    }

    fun createEdicion(dto: CreateEdicionDto): Edicion {
        val edicionNormalizada = dto.normalizar()

        // Convertir y validar fechas
        val fechaInicio = LocalDate.parse(edicionNormalizada.fechaInicio, dateFormatter)
        val fechaFin = LocalDate.parse(edicionNormalizada.fechaFin, dateFormatter)

        if (fechaInicio.isAfter(fechaFin)) {
            throw IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin")
        }

        // Verificar que no exista una edición con el mismo título (sin importar el curso)
        if (edicionRepository.existsByTituloIgnoreCase(edicionNormalizada.titulo)) {
            throw IllegalArgumentException("Ya existe una edición con el título '${edicionNormalizada.titulo}'")
        }

        val edicion = Edicion(
            titulo = edicionNormalizada.titulo,
            fechaInicio = fechaInicio,
            fechaFin = fechaFin,
            cursoId = edicionNormalizada.cursoId.toInt(),
            estado = true
        )

        return edicionRepository.save(edicion)
    }

    fun updateEdicion(id: Long, updateDto: UpdateEdicionDto): Edicion {
        if (updateDto.isEmpty()) {
            throw IllegalArgumentException("No se proporcionaron datos para actualizar")
        }

        val edicionNormalizada = updateDto.normalizar()
        val existingEdicion = edicionRepository.getEdicionById(id)
            ?: throw NoSuchElementException("No se encontró la edición con ID $id")

        // Convertir y validar fechas
        val fechaInicio = edicionNormalizada.fechaInicio?.let {
            LocalDate.parse(it, dateFormatter)
        } ?: existingEdicion.fechaInicio

        val fechaFin = edicionNormalizada.fechaFin?.let {
            LocalDate.parse(it, dateFormatter)
        } ?: existingEdicion.fechaFin

        if (fechaInicio.isAfter(fechaFin)) {
            throw IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha de fin")
        }

        // Verificar duplicados en título (excepto para esta edición)
        edicionNormalizada.titulo?.let { nuevoTitulo ->
            if (edicionRepository.existsByTituloIgnoreCaseAndIdNot(nuevoTitulo, id)) {
                throw IllegalArgumentException("Ya existe otra edición con el título '$nuevoTitulo'")
            }
        }

        val edicionActualizada = existingEdicion.copy(
            titulo = edicionNormalizada.titulo ?: existingEdicion.titulo,
            fechaInicio = fechaInicio,
            fechaFin = fechaFin,
            cursoId = edicionNormalizada.cursoId?.toInt() ?: existingEdicion.cursoId
        )

        return edicionRepository.save(edicionActualizada)
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