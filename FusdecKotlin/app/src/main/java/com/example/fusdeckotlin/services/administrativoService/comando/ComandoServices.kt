package com.example.fusdeckotlin.services.administrativoService.comando

import com.example.fusdeckotlin.models.administrativo.comando.Comando

class ComandoServices {

    companion object {
        fun crearComando(
            comandos: MutableList<Comando>,
            id: String,
            nombreComando: String,
            estadoComando: Boolean = true,
            ubicacionComando: String,
            fundacionId: String,
            brigadas: List<String> = emptyList()
        ): Comando {
            if (nombreComando.isBlank() || brigadas.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreComando, brigadas")
            }

            val nuevoComando = Comando(
                id = id,
                nombreComando = nombreComando,
                estadoComando = estadoComando,
                ubicacionComando = ubicacionComando,
                fundacionId = fundacionId,
                brigadas = brigadas
            )

            comandos.add(nuevoComando)
            return nuevoComando
        }

        fun listarComandosActivos(comandos: List<Comando>): List<Comando> {
            return comandos.filter { it.getEstadoComando() }
        }

        fun obtenerComandoPorId(comandos: List<Comando>, id: String): Comando {
            return comandos.find { it.getId() == id } ?: throw NoSuchElementException("Comando no encontrado")
        }

        fun actualizarComando(
            comandos: MutableList<Comando>,
            id: String,
            nombreComando: String? = null,
            estadoComando: Boolean? = null,
            ubicacionComando: String? = null,
            fundacionId: String? = null,
            brigadas: List<String>? = null
        ): Comando {
            val comando = comandos.find { it.getId() == id } ?: throw NoSuchElementException("Comando no encontrado")

            nombreComando?.let { comando.setNombreComando(it) }
            estadoComando?.let { comando.setEstadoComando(it) }
            ubicacionComando?.let { comando.setUbicacionComando(it) }
            fundacionId?.let { comando.setFundacionId(it) }
            brigadas?.let { comando.setBrigadas(it) }

            return comando
        }

        fun desactivarComando(comandos: MutableList<Comando>, id: String): Comando {
            val comando = comandos.find { it.getId() == id } ?: throw NoSuchElementException("Comando no encontrado")
            comando.setEstadoComando(false)
            return comando
        }
    }
}