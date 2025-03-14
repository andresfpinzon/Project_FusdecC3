package models.administrativo.unidad

import java.util.*

class UnidadServicio(){

    companion object {
        fun crearUnidad(
            unidades: MutableList<Unidad>,
            id: String,
            nombreUnidad: String,
            brigadaId: String,
            usuarioId: String,
            estudiantes: List<String>
        ): Unidad {
            if (nombreUnidad.isBlank() || estudiantes.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreUnidad, estudiantes")
            }

            val nuevaUnidad = Unidad(
                id = id,
                nombreUnidad = nombreUnidad,
                estadoUnidad = true,
                brigadaId = brigadaId,
                usuarioId = usuarioId,
                estudiantes = estudiantes
            )

            unidades.add(nuevaUnidad)
            return nuevaUnidad
        }

        fun listarUnidadesActivas(unidades: List<Unidad>): List<Unidad> {
            return unidades.filter { it.estadoUnidad }
        }

        fun obtenerUnidadPorId(unidades: List<Unidad>, id: String): Unidad {
            return unidades.find { it.id == id } ?: throw NoSuchElementException("Unidad no encontrada")
        }

        fun actualizarUnidad(
            unidades: MutableList<Unidad>,
            id: String,
            nombreUnidad: String? = null,
            brigadaId: String? = null,
            usuarioId: String? = null,
            estudiantes: List<String>? = null
        ): Unidad {
            val unidad = unidades.find { it.id == id } ?: throw NoSuchElementException("Unidad no encontrada")

            unidad.nombreUnidad = nombreUnidad ?: unidad.nombreUnidad
            unidad.brigadaId = brigadaId ?: unidad.brigadaId
            unidad.usuarioId = usuarioId ?: unidad.usuarioId
            unidad.estudiantes = estudiantes ?: unidad.estudiantes

            return unidad
        }

        fun desactivarUnidad(unidades: MutableList<Unidad>, id: String): Unidad {
            val unidad = unidades.find { it.id == id } ?: throw NoSuchElementException("Unidad no encontrada")
            unidad.estadoUnidad = false
            return unidad
        }
    }
}
