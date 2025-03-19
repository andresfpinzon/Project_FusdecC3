package com.example.fusdeckotlin.controllers.administrativo.unidad

import Unidad
import com.example.fusdeckotlin.services.administrativoService.unidad.UnidadServices
import java.util.Scanner

class UnidadController {

    companion object {

        private val scanner = Scanner(System.`in`)

        private fun confirmarAccion(mensaje: String): Boolean {
            println("$mensaje (1: Sí, 2: No)")
            return scanner.nextLine() == "1"
        }

        fun crearUnidad(unidades: MutableList<Unidad>) {
            println("Ingrese los datos de la unidad:")
            print("ID: ")
            val id = scanner.next()
            print("Nombre: ")
            val nombre = scanner.next()
            print("Brigada ID: ")
            val brigadaId = scanner.next()
            print("Usuario ID: ")
            val usuarioId = scanner.next()
            print("Comandos (separados por comas): ")
            val comandos = scanner.next().split(",")
            print("Estudiantes (separados por comas): ")
            val estudiantes = scanner.next().split(",")

            if (confirmarAccion("¿Desea crear esta unidad?")) {
                try {
                    val nuevaUnidad = UnidadServices.crearUnidad(
                        unidades = unidades,
                        id = id,
                        nombreUnidad = nombre,
                        estadoUnidad = true,
                        brigadaId = brigadaId,
                        usuarioId = usuarioId,
                        comandos = comandos,
                        estudiantes = estudiantes
                    )
                    println("Unidad creada: $nuevaUnidad")
                } catch (e: IllegalArgumentException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }

        fun listarUnidadesActivas(unidades: List<Unidad>) {
            val unidadesActivas = UnidadServices.listarUnidadesActivas(unidades)
            if (unidadesActivas.isEmpty()) {
                println("No hay unidades activas.")
            } else {
                println("Unidades activas:")
                unidadesActivas.forEach { println(it) }
            }
        }

        fun actualizarUnidad(unidades: MutableList<Unidad>) {
            print("Ingrese el ID de la unidad a actualizar: ")
            val id = scanner.next()

            try {
                val unidad = UnidadServices.obtenerUnidadPorId(unidades, id)
                println("Unidad encontrada: $unidad")

                print("Nuevo nombre (dejar en blanco para no cambiar): ")
                val nombre = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva brigada ID (dejar en blanco para no cambiar): ")
                val brigadaId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo usuario ID (dejar en blanco para no cambiar): ")
                val usuarioId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevos comandos (dejar en blanco para no cambiar): ")
                val comandos = scanner.nextLine().split(",").takeIf { it.isNotEmpty() }

                if (confirmarAccion("¿Desea actualizar esta unidad?")) {
                    val unidadActualizada = UnidadServices.actualizarUnidad(
                        unidades = unidades,
                        id = id,
                        nombreUnidad = nombre,
                        brigadaId = brigadaId,
                        usuarioId = usuarioId,
                        comandos = comandos
                    )
                    println("Unidad actualizada: $unidadActualizada")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }

        fun desactivarUnidad(unidades: MutableList<Unidad>) {
            print("Ingrese el ID de la unidad a desactivar: ")
            val id = scanner.next()

            try {
                val unidad = UnidadServices.obtenerUnidadPorId(unidades, id)
                println("Unidad encontrada: $unidad")

                if (confirmarAccion("¿Desea desactivar esta unidad?")) {
                    val unidadDesactivada = UnidadServices.desactivarUnidad(unidades, id)
                    println("Unidad desactivada: $unidadDesactivada")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }
    }
}