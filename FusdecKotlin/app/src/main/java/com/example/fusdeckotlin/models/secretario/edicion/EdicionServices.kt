package models.secretario.edicion

import java.time.LocalDate
import java.util.*

class EdicionServices {

    companion object {
        private val ediciones = mutableListOf<EdicionModel>()

        fun crearEdicion(
            id: String = UUID.randomUUID().toString(),
            tituloEdicion: String,
            fechaInicioEdicion: LocalDate,
            fechaFinEdicion: LocalDate,
            cursoId: String,
            estadoEdicion: Boolean = true,
            horarios: List<String> = emptyList(),
            estudiantes: List<String> = emptyList()
        ): EdicionModel {
            if (tituloEdicion.isBlank() || cursoId.isBlank()) {
                throw IllegalArgumentException("El título y el curso ID son obligatorios")
            }

            val nuevaEdicion = EdicionModel(
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

        fun listarEdiciones(): List<EdicionModel> = ediciones

        fun obtenerEdicionPorId(id: String): EdicionModel {
            return ediciones.find { it.id == id } ?: throw NoSuchElementException("Edición no encontrada")
        }

        fun actualizarEdicion(
            id: String,
            tituloEdicion: String? = null,
            fechaInicioEdicion: LocalDate? = null,
            fechaFinEdicion: LocalDate? = null,
            estadoEdicion: Boolean? = null,
            cursoId: String? = null,
            horarios: List<String>? = null,
            estudiantes: List<String>? = null
        ): EdicionModel {
            val edicion = obtenerEdicionPorId(id)

            edicion.tituloEdicion = tituloEdicion ?: edicion.tituloEdicion
            edicion.fechaInicioEdicion = fechaInicioEdicion ?: edicion.fechaInicioEdicion
            edicion.fechaFinEdicion = fechaFinEdicion ?: edicion.fechaFinEdicion
            edicion.estadoEdicion = estadoEdicion ?: edicion.estadoEdicion
            edicion.cursoId = cursoId ?: edicion.cursoId
            edicion.horarios = horarios ?: edicion.horarios
            edicion.estudiantes = estudiantes ?: edicion.estudiantes

            return edicion
        }

        fun desactivarEdicion(id: String): EdicionModel {
            val edicion = obtenerEdicionPorId(id)
            edicion.estadoEdicion = false
            return edicion
        }

        fun eliminarEdicion(id: String): Boolean {
            return ediciones.removeIf { it.id == id }
        }
    }
}
