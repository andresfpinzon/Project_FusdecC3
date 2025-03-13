package models.administrativo.comando

import java.util.Scanner

class ComandoController() {

    companion object {

        private val scanner = Scanner(System.`in`)

        private fun confirmarAccion(mensaje: String): Boolean {
            println("$mensaje (1: Sí, 2: No)")
            return scanner.nextLine() == "1"
        }

        fun crearComando(comandos: MutableList<Comando>) {
            println("Ingrese los datos del comando:")
            print("ID: ")
            val id = scanner.next()
            print("Nombre: ")
            val nombre = scanner.next()
            print("Estado (true/false): ")
            val estado = scanner.nextBoolean()
            print("Ubicación: ")
            val ubicacion = scanner.next()
            print("Fundación ID: ")
            val fundacionId = scanner.next()
            print("Brigadas (separadas por comas): ")
            val brigadas = scanner.next().split(",")

            if (confirmarAccion("¿Desea crear este comando?")) {
                try {
                    val nuevoComando = ComandoServicio.crearComando(
                        comandos = comandos,
                        id = id,
                        nombreComando = nombre,
                        estadoComando = estado,
                        ubicacionComando = ubicacion,
                        fundacionId = fundacionId,
                        brigadas = brigadas
                    )
                    println("Comando creado: $nuevoComando")
                } catch (e: IllegalArgumentException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }

        fun listarComandosActivos(comandos: List<Comando>) {
            val comandosActivos = ComandoServicio.listarComandosActivos(comandos)
            if (comandosActivos.isEmpty()) {
                println("No hay comandos activos.")
            } else {
                println("Comandos activos:")
                comandosActivos.forEach { println(it) }
            }
        }

        fun actualizarComando(comandos: MutableList<Comando>) {
            print("Ingrese el ID del comando a actualizar: ")
            val id = scanner.next()
            scanner.nextLine() // Consumir la nueva línea pendiente

            try {
                val comando = ComandoServicio.obtenerComandoPorId(comandos, id)
                println("Comando encontrado: $comando")

                print("Nuevo nombre (dejar en blanco para no cambiar): ")
                val nombre = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo estado (dejar en blanco para no cambiar): ")
                val estado = scanner.nextLine().takeIf { it.isNotBlank() }?.toBoolean()
                print("Nueva ubicación (dejar en blanco para no cambiar): ")
                val ubicacion = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva fundación ID (dejar en blanco para no cambiar): ")
                val fundacionId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevas brigadas (separadas por comas, dejar en blanco para no cambiar): ")
                val brigadas = scanner.nextLine().takeIf { it.isNotBlank() }?.split(",")

                if (confirmarAccion("¿Desea actualizar este comando?")) {
                    val comandoActualizado = ComandoServicio.actualizarComando(
                        comandos = comandos,
                        id = id,
                        nombreComando = nombre,
                        estadoComando = estado,
                        ubicacionComando = ubicacion,
                        fundacionId = fundacionId,
                        brigadas = brigadas
                    )
                    println("Comando actualizado: $comandoActualizado")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }

        fun desactivarComando(comandos: MutableList<Comando>) {
            print("Ingrese el ID del comando a desactivar: ")
            val id = scanner.next()

            if (confirmarAccion("¿Desea desactivar este comando?")) {
                try {
                    val comandoDesactivado = ComandoServicio.desactivarComando(comandos, id)
                    println("Comando desactivado: $comandoDesactivado")
                } catch (e: NoSuchElementException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }
    }
}