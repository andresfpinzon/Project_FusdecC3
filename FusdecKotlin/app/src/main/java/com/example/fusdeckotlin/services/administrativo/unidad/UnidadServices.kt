package com.example.fusdeckotlin.services.administrativo.unidad

import com.example.fusdeckotlin.models.administrativo.unidad.Unidad

class UnidadServices {

    companion object {
        fun crearUnidad(
            unidades: MutableList<Unidad>,
            id: String,
            nombreUnidad: String,
            brigadaId: String,
            estadoUnidad: Boolean,
            usuarioId: String,
            comandos: List<String>,
            estudiantes: List<String>
        ): Unidad {
            if (nombreUnidad.isBlank() || brigadaId.isBlank() || usuarioId.isBlank()) {
                throw IllegalArgumentException("Todos los campos son obligatorios")
            }

            val nuevaUnidad = Unidad(
                id = id,
                nombreUnidad = nombreUnidad,
                brigadaId = brigadaId,
                estadoUnidad = estadoUnidad,
                usuarioId = usuarioId,
                comandos = comandos,
                estudiantes = estudiantes
            )
            unidades.add(nuevaUnidad)
            return nuevaUnidad
        }

        fun actualizarUnidad(
            unidades: MutableList<Unidad>,
            id: String,
            nombreUnidad: String?,
            brigadaId: String?,
            estadoUnidad: Boolean?,
            usuarioId: String?,
            comandos: List<String>?,
            estudiantes: List<String>?
        ): Unidad {
            val unidad = obtenerUnidadPorId(unidades, id)
            nombreUnidad?.let { unidad.setNombreUnidad(it) }
            brigadaId?.let { unidad.setBrigadaId(it) }
            estadoUnidad?.let { unidad.setEstadoUnidad(it) }
            usuarioId?.let { unidad.setUsuarioId(it) }
            comandos?.let { unidad.setComandos(it) }
            estudiantes?.let { unidad.setEstudiantes(it) }
            return unidad
        }

        fun desactivarUnidad(unidades: MutableList<Unidad>, id: String): Unidad {
            val unidad = obtenerUnidadPorId(unidades, id)
            unidad.setEstadoUnidad(false)
            return unidad
        }

        fun obtenerUnidadPorId(unidades: List<Unidad>, id: String): Unidad {
            return unidades.firstOrNull { it.getId() == id }
                ?: throw NoSuchElementException("Unidad no encontrada")
        }

        fun listarUnidadesActivas(unidades: List<Unidad>): List<Unidad> {
            return unidades.filter { it.getEstadoUnidad() }
        }
    }
}