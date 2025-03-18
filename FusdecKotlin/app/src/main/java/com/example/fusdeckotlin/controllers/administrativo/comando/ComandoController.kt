package com.example.fusdeckotlin.controllers.administrativo.comando

import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.services.administrativoService.comando.ComandoServices
import java.util.Scanner

class ComandoController {

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
            print("Ubicación: ")
            val ubicacion = scanner.next()
            print("Fundación ID: ")
            val fundacionId = scanner.next()
            print("Brigadas (separadas por comas): ")
            val brigadas = scanner.next().split(",")

            if (confirmarAccion("¿Desea crear este comando?")) {
                try {
                    val nuevoComando = ComandoServices.crearComando(
                        comandos = comandos,
                        id = id,
                        nombreComando = nombre,
                        estadoComando = true,
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
            val comandosActivos = ComandoServices.listarComandosActivos(comandos)
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

            try {
                val comando = ComandoServices.obtenerComandoPorId(comandos, id)
                println("Comando encontrado: $comando")

                print("Nuevo nombre (dejar en blanco para no cambiar): ")
                val nombre = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva ubicación (dejar en blanco para no cambiar): ")
                val ubicacion = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo fundación ID (dejar en blanco para no cambiar): ")
                val fundacionId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevas brigadas (dejar en blanco para no cambiar): ")
                val brigadas = scanner.nextLine().split(",").takeIf { it.isNotEmpty() }

                if (confirmarAccion("¿Desea actualizar este comando?")) {
                    val comandoActualizado = ComandoServices.actualizarComando(
                        comandos = comandos,
                        id = id,
                        nombreComando = nombre,
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

            try {
                val comando = ComandoServices.obtenerComandoPorId(comandos, id)
                println("Comando encontrado: $comando")

                if (confirmarAccion("¿Desea desactivar este comando?")) {
                    val comandoDesactivado = ComandoServices.desactivarComando(comandos, id)
                    println("Comando desactivado: $comandoDesactivado")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }
    }
}