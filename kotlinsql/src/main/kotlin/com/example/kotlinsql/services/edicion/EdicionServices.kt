package com.example.kotlinsql.services.edicion

import com.example.kotlinsql.model.edicion.Edicion
import com.example.kotlinsql.repositories.edicion.EdicionRepository
import org.springframework.stereotype.Service

@Service
class EdicionServices (
    private val edicionRepository: EdicionRepository
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
            curso = null
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
}