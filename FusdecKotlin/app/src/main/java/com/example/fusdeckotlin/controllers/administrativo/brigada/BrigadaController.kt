package com.example.fusdeckotlin.controllers.administrativo.brigada

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.services.administrativoService.brigada.BrigadaServices
import java.util.Scanner

class BrigadaController {

    companion object {

        private val scanner = Scanner(System.`in`)

        private fun confirmarAccion(mensaje: String): Boolean {
            println("$mensaje (1: Sí, 2: No)")
            return scanner.nextLine() == "1"
        }

        fun crearBrigada(brigadas: MutableList<Brigada>) {
            println("Ingrese los datos de la brigada:")
            print("ID: ")
            val id = scanner.next()
            print("Nombre: ")
            val nombre = scanner.next()
            print("Ubicación: ")
            val ubicacion = scanner.next()
            print("Comando ID: ")
            val comandoId = scanner.next()
            print("Unidades (separadas por comas): ")
            val unidades = scanner.next().split(",")
            print("Estado (true/false): ")
            val estadoBrigada = scanner.nextBoolean()

            if (confirmarAccion("¿Desea crear esta brigada?")) {
                try {
                    val nuevaBrigada = BrigadaServices.crearBrigada(
                        brigadas = brigadas,
                        id = id,
                        nombreBrigada = nombre,
                        ubicacionBrigada = ubicacion,
                        comandoId = comandoId,
                        unidades = unidades,
                        estadoBrigada = estadoBrigada
                    )
                    println("Brigada creada: $nuevaBrigada")
                } catch (e: IllegalArgumentException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }

        fun listarBrigadasActivas(brigadas: List<Brigada>) {
            val brigadasActivas = BrigadaServices.listarBrigadasActivas(brigadas)
            if (brigadasActivas.isEmpty()) {
                println("No hay brigadas activas.")
            } else {
                println("Brigadas activas:")
                brigadasActivas.forEach { println(it) }
            }
        }

        fun actualizarBrigada(brigadas: MutableList<Brigada>) {
            print("Ingrese el ID de la brigada a actualizar: ")
            val id = scanner.next()

            try {
                val brigada = BrigadaServices.obtenerBrigadaPorId(brigadas, id)
                println("Brigada encontrada: $brigada")

                print("Nuevo nombre (dejar en blanco para no cambiar): ")
                val nombre = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva ubicación (dejar en blanco para no cambiar): ")
                val ubicacion = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo comando ID (dejar en blanco para no cambiar): ")
                val comandoId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevas unidades (dejar en blanco para no cambiar): ")
                val unidades = scanner.nextLine().split(",").takeIf { it.isNotEmpty() }
                print("Nuevo estado (true/false): ")
                val estadoBrigada = scanner.nextBoolean()

                if (confirmarAccion("¿Desea actualizar esta brigada?")) {
                    val brigadaActualizada = BrigadaServices.actualizarBrigada(
                        brigadas = brigadas,
                        id = id,
                        nombreBrigada = nombre,
                        ubicacionBrigada = ubicacion,
                        comandoId = comandoId,
                        unidades = unidades,
                        estadoBrigada = estadoBrigada
                    )
                    println("Brigada actualizada: $brigadaActualizada")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }

        fun desactivarBrigada(brigadas: MutableList<Brigada>) {
            print("Ingrese el ID de la brigada a desactivar: ")
            val id = scanner.next()

            try {
                val brigada = BrigadaServices.obtenerBrigadaPorId(brigadas, id)
                println("Brigada encontrada: $brigada")

                if (confirmarAccion("¿Desea desactivar esta brigada?")) {
                    val brigadaDesactivada = BrigadaServices.desactivarBrigada(brigadas, id)
                    println("Brigada desactivada: $brigadaDesactivada")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }
    }
}