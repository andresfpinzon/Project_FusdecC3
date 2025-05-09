package com.example.kotlinsql.services.unidad

import com.example.kotlinsql.dto.unidad.CreateUnidadDto
import com.example.kotlinsql.dto.unidad.UpdateUnidadDto
import com.example.kotlinsql.model.unidad.Unidad
import com.example.kotlinsql.repositories.unidad.UnidadRespository
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service

@Service
class UnidadServices (
    private val unidadRepository: UnidadRespository,
){
    fun crearUnidadService(data: CreateUnidadDto): Unidad {
        val unidadNormalizada = data.normalizar()

        // Verificar si ya existe una unidad con el mismo nombre
        val existeNombre = unidadRepository.existsByNombreUnidad(unidadNormalizada.nombreUnidad)
        if (existeNombre) {
            throw IllegalArgumentException("Ya existe una unidad con el nombre '${unidadNormalizada.nombreUnidad}'")
        }



        val unidad = Unidad(
            nombreUnidad = unidadNormalizada.nombreUnidad,
            brigadaId = unidadNormalizada.brigadaId,
            usuarioId = unidadNormalizada.usuarioId,
        )

        return try {
            unidadRepository.save(unidad)
        } catch (e: DataIntegrityViolationException) {
            throw IllegalArgumentException("Error al crear la unidad: ${e.message}")
        }
    }

    fun obtenerUnidades(): List<Unidad> {
        val unidades =  unidadRepository.findAll()
        return  unidades
    }

    fun obtenerUnidadPorId(id: Long): Unidad? {
        return unidadRepository.findById(id).orElse(null)
    }

    fun eliminarUnidadPorId(id: Long): Boolean {
        return if (unidadRepository.existsById(id)) {
            unidadRepository.deleteById(id)
            true
        } else {
            false
        }
    }
    fun actualizarUnidad(id: Long, data: UpdateUnidadDto): Unidad? {
        if (data.isEmpty()) {
            throw IllegalArgumentException("No se proporcionaron datos para actualizar")
        }

        val unidadNormalizada = data.normalizar()
        val unidad = unidadRepository.findById(id).orElse(null)
            ?: throw NoSuchElementException("No se encontró la unidad con ID $id")

        // Verificar si el nuevo nombre ya existe en otra unidad
        unidadNormalizada.nombreUnidad?.let { nuevoNombre ->
            if (unidadRepository.existsByNombreUnidadAndIdNot(nuevoNombre, id)) {
                throw IllegalArgumentException("Ya existe otra unidad con el nombre '$nuevoNombre'")
            }
        }

        val updatedUnidad = unidad.copy(
            nombreUnidad = unidadNormalizada.nombreUnidad ?: unidad.nombreUnidad,
            brigadaId = unidadNormalizada.brigadaId ?: unidad.brigadaId,
            usuarioId = unidadNormalizada.usuarioId ?: unidad.usuarioId,
        )

        return try {
            unidadRepository.save(updatedUnidad)
        } catch (e: DataIntegrityViolationException) {
            throw IllegalArgumentException("Error al actualizar la unidad: ${e.message}")
        }
    }
}
