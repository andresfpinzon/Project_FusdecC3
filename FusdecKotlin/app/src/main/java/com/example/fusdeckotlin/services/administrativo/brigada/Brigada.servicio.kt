package models.administrativo.brigada

import java.util.*

class BrigadaServicio(){

    companion object{
        fun crearBrigada(
            brigadas: MutableList<Brigada>,
            id: String,
            nombreBrigada: String,
            ubicacionBrigada: String,
            comandoId: String,
            unidades: List<String>
        ): Brigada {
            if (nombreBrigada.isBlank() || unidades.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreBrigada, unidades")
            }

            val nuevaBrigada = Brigada(
                id = id,
                nombreBrigada = nombreBrigada,
                ubicacionBrigada = ubicacionBrigada,
                estadoBrigada = true,
                comandoId = comandoId,
                unidades = unidades
            )

            brigadas.add(nuevaBrigada)
            return nuevaBrigada
        }
        fun listarBrigadasActivas(brigadas: List<Brigada>): List<Brigada> {
            return brigadas.filter { it.estadoBrigada }
        }
        fun obtenerBrigadaPorId(brigadas: List<Brigada>, id: String): Brigada {
            return brigadas.find { it.id == id } ?: throw NoSuchElementException("Brigada no encontrada")
        }

        fun actualizarBrigada(
            brigadas: MutableList<Brigada>,
            id: String,
            nombreBrigada: String? = null,
            ubicacionBrigada: String? = null,
            comandoId: String? = null,
            unidades: List<String>? = null
        ): Brigada {
            val brigada = brigadas.find { it.id == id } ?: throw NoSuchElementException("Brigada no encontrada")

            brigada.nombreBrigada = nombreBrigada ?: brigada.nombreBrigada
            brigada.ubicacionBrigada = ubicacionBrigada ?: brigada.ubicacionBrigada
            brigada.comandoId = comandoId ?: brigada.comandoId
            brigada.unidades = unidades ?: brigada.unidades


            return brigada
        }
        fun desactivarBrigada(brigadas: MutableList<Brigada>, id: String): Brigada {
            val brigada = brigadas.find { it.id == id } ?: throw NoSuchElementException("Brigada no encontrada")
            brigada.estadoBrigada = false
            return brigada
        }
    }
}