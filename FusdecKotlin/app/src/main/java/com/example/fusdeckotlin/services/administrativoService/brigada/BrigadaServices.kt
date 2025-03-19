package com.example.fusdeckotlin.services.administrativoService.brigada

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada

class BrigadaServices {

    companion object {
        fun crearBrigada(
            brigadas: MutableList<Brigada>,
            id: String,
            nombreBrigada: String,
            ubicacionBrigada: String,
            estadoBrigada: Boolean =true,
            comandoId: String,
            unidades: List<String> = emptyList()
        ): Brigada {
            if (nombreBrigada.isBlank() || ubicacionBrigada.isBlank() || comandoId.isBlank() || unidades.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreBrigada, ubicacionBrigada, comandoId, unidades")
            }

            val nuevaBrigada = Brigada(
                id = id,
                nombreBrigada = nombreBrigada,
                ubicacionBrigada = ubicacionBrigada,
                estadoBrigada = estadoBrigada,
                comandoId = comandoId,
                unidades = unidades
            )

            brigadas.add(nuevaBrigada)
            return nuevaBrigada
        }

        fun listarBrigadasActivas(brigadas: List<Brigada>): List<Brigada> {
            return brigadas.filter { it.getEstadoBrigada() }
        }

        fun obtenerBrigadaPorId(brigadas: List<Brigada>, id: String): Brigada {
            return brigadas.find { it.getId() == id } ?: throw NoSuchElementException("Brigada no encontrada")
        }

        fun actualizarBrigada(
            brigadas: MutableList<Brigada>,
            id: String,
            nombreBrigada: String? = null,
            ubicacionBrigada: String? = null,
            comandoId: String? = null,
            unidades: List<String>? = null,
            estadoBrigada: Boolean
        ): Brigada {
            val brigada = brigadas.find { it.getId() == id } ?: throw NoSuchElementException("Brigada no encontrada")

            nombreBrigada?.let { brigada.setNombreBrigada(it) }
            ubicacionBrigada?.let { brigada.setUbicacionBrigada(it) }
            comandoId?.let { brigada.setComandoId(it) }
            unidades?.let { brigada.setUnidades(it) }
            brigada.setEstadoBrigada(estadoBrigada)

            return brigada
        }

        fun desactivarBrigada(brigadas: MutableList<Brigada>, id: String): Brigada {
            val brigada = brigadas.find { it.getId() == id } ?: throw NoSuchElementException("Brigada no encontrada")
            brigada.setEstadoBrigada(false)
            return brigada
        }
    }
}