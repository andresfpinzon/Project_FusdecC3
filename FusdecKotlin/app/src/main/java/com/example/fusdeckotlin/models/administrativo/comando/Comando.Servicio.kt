package models.administrativo.comando

import java.util.*

class ComandoServicio(){

    companion object{
        fun crearComando(
            comandos: MutableList<Comando>,
            id: String,
            nombreComando: String,
            estadoComando: Boolean,
            ubicacionComando: String,
            fundacionId: String,
            brigadas: List<String>
        ): Comando {
            if (nombreComando.isBlank() || ubicacionComando.isBlank() || brigadas.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreComando, ubicacionComando, brigadas")
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
            return comandos.filter { it.estadoComando }
        }
        fun obtenerComandoPorId(comandos: List<Comando>, id: String): Comando {
            return comandos.find { it.id == id } ?: throw NoSuchElementException("Comando no encontrado")
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
            val comando = comandos.find { it.id == id } ?: throw NoSuchElementException("Comando no encontrado")

            comando.nombreComando = nombreComando ?: comando.nombreComando
            comando.estadoComando = estadoComando ?: comando.estadoComando
            comando.ubicacionComando = ubicacionComando ?: comando.ubicacionComando
            comando.fundacionId = fundacionId ?: comando.fundacionId
            comando.brigadas = brigadas ?: comando.brigadas

            return comando
        }

        fun desactivarComando(comandos: MutableList<Comando>, id: String): Comando {
            val comando = comandos.find { it.id == id } ?: throw NoSuchElementException("Comando no encontrado")
            comando.estadoComando = false
            return comando
        }
    }
}