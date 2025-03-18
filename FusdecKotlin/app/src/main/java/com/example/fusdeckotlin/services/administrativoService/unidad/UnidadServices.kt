package com.example.fusdeckotlin.services.administrativoService.unidad

import Unidad


class UnidadServices {

    companion object {
        fun crearUnidad(
            unidades: MutableList<Unidad>,
            id: String,
            nombreUnidad: String,
            estadoUnidad: Boolean,
            brigadaId: String,
            usuarioId: String,
            comandos: List<String>
        ): Unidad {
            if (nombreUnidad.isBlank() || comandos.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreUnidad, comandos")
            }

            val nuevaUnidad = Unidad(
                id = id,
                nombreUnidad = nombreUnidad,
                estadoUnidad = estadoUnidad,
                brigadaId = brigadaId,
                usuarioId = usuarioId,
                comandos = comandos
            )

            unidades.add(nuevaUnidad)
            return nuevaUnidad
        }

        fun listarUnidadesActivas(unidades: List<Unidad>): List<Unidad> {
            return unidades.filter { it.getEstadoUnidad() }
        }

        fun obtenerUnidadPorId(unidades: List<Unidad>, id: String): Unidad {
            return unidades.find { it.getId() == id } ?: throw NoSuchElementException("Unidad no encontrada")
        }

        fun actualizarUnidad(
            unidades: MutableList<Unidad>,
            id: String,
            nombreUnidad: String? = null,
            estadoUnidad: Boolean? = null,
            brigadaId: String? = null,
            usuarioId: String? = null,
            comandos: List<String>? = null
        ): Unidad {
            val unidad = unidades.find { it.getId() == id } ?: throw NoSuchElementException("Unidad no encontrada")

            nombreUnidad?.let { unidad.setNombreUnidad(it) }
            estadoUnidad?.let { unidad.setEstadoUnidad(it) }
            brigadaId?.let { unidad.setBrigadaId(it) }
            usuarioId?.let { unidad.setUsuarioId(it) }
            comandos?.let { unidad.setComandos(it) }

            return unidad
        }

        fun desactivarUnidad(unidades: MutableList<Unidad>, id: String): Unidad {
            val unidad = unidades.find { it.getId() == id } ?: throw NoSuchElementException("Unidad no encontrada")
            unidad.setEstadoUnidad(false)
            return unidad
        }
    }
}