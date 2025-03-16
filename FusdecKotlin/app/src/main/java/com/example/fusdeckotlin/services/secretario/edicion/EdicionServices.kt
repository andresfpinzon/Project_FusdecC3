package com.example.fusdeckotlin.services.secretario.edicion

import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import models.secretario.edicion.Edicion
import java.util.*

class EdicionServices {

    companion object {

        fun crearEdicion(
            ediciones: MutableList<Edicion>,
            id: String = UUID.randomUUID().toString(),
            tituloEdicion: String,
            fechaInicioEdicion: Date,
            fechaFinEdicion: Date,
            cursoId: String,
            estadoEdicion: Boolean = true,
            horarios: List<String> = emptyList(),
            estudiantes: List<String> = emptyList()
        ): Edicion {
            if (tituloEdicion.isBlank() || cursoId.isBlank()) {
                throw IllegalArgumentException("El título y el curso ID son obligatorios")
            }

            val nuevaEdicion = Edicion(
                id = id,
                tituloEdicion = tituloEdicion,
                fechaInicioEdicion = fechaInicioEdicion,
                fechaFinEdicion = fechaFinEdicion,
                estadoEdicion = estadoEdicion,
                cursoId = cursoId,
                horarios = horarios,
                estudiantes = estudiantes
            )

            ediciones.add(nuevaEdicion)
            return nuevaEdicion
        }

        fun listarEdicionesActivas(ediciones: List<Edicion>): List<Edicion> {
            return ediciones.filter { it.getEstadoEdicion() }
        }

        fun obtenerEdicionPorId(ediciones: List<Edicion>, id: String): Edicion {
            return ediciones.find { it.getId() == id } ?: throw NoSuchElementException("Edicion no encontrada")
        }

        fun actualizarEdicion(
            ediciones: MutableList<Edicion>,
            id: String,
            tituloEdicion: String? = null,
            fechaInicioEdicion: Date? = null,
            fechaFinEdicion: Date? = null,
            estadoEdicion: Boolean? = null,
            cursoId: String? = null,
            horarios: List<String>? = null,
            estudiantes: List<String>? = null
        ): Edicion {
            val edicion = ediciones.find { it.getId() == id } ?: throw NoSuchElementException("Edicion no encontrada")

            tituloEdicion?.let { edicion.setTituloEdicion(it) }
            fechaInicioEdicion?.let { edicion.setFechaInicioEdicion(it) }
            fechaFinEdicion?.let { edicion.setFechaFinEdicion(it) }
            estadoEdicion?.let { edicion.setEstadoEdicion(it) }
            cursoId?.let { edicion.setCursoId(it) }

            return edicion
        }

        fun desactivarEdicion(ediciones: MutableList<Edicion>, id: String): Edicion {
            val edicion = ediciones.find { it.getId() == id } ?: throw NoSuchElementException("Edición no encontrada")
            edicion.setEstadoEdicion(false)
            return edicion
        }
    }
}
