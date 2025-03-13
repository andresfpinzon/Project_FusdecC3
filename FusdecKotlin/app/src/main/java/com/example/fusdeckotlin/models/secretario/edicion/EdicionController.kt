package models.secretario.edicion

import java.time.LocalDate
import java.util.Scanner

class EdicionController {
    companion object {
        private val scanner = Scanner(System.`in`)

        private fun confirmarAccion(mensaje: String): Boolean {
            println("\$mensaje (1: Sí, 2: No)")
            return scanner.nextLine() == "1"
        }

        fun crearEdicion() {
            println("Ingrese los datos de la edición:")
            print("Título: ")
            val titulo = scanner.nextLine()
            print("Fecha de inicio (yyyy-MM-dd): ")
            val fechaInicio = LocalDate.parse(scanner.nextLine())
            print("Fecha de fin (yyyy-MM-dd): ")
            val fechaFin = LocalDate.parse(scanner.nextLine())
            print("Curso ID: ")
            val cursoId = scanner.nextLine()
            print("Horarios (separados por comas): ")
            val horarios = scanner.nextLine().split(",").map { it.trim() }
            print("Estudiantes (separados por comas): ")
            val estudiantes = scanner.nextLine().split(",").map { it.trim() }

            if (confirmarAccion("¿Desea crear esta edición?")) {
                try {
                    val nuevaEdicion = EdicionServices.crearEdicion(
                        tituloEdicion = titulo,
                        fechaInicioEdicion = fechaInicio,
                        fechaFinEdicion = fechaFin,
                        cursoId = cursoId,
                        horarios = horarios,
                        estudiantes = estudiantes
                    )
                    println("Edición creada: \$nuevaEdicion")
                } catch (e: IllegalArgumentException) {
                    println("Error: \${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }

        fun listarEdiciones() {
            val ediciones = EdicionServices.listarEdiciones()
            if (ediciones.isEmpty()) {
                println("No hay ediciones registradas.")
            } else {
                println("Ediciones disponibles:")
                ediciones.forEach { println(it) }
            }
        }

        fun actualizarEdicion() {
            print("Ingrese el ID de la edición a actualizar: ")
            val id = scanner.nextLine()

            try {
                val edicion = EdicionServices.obtenerEdicionPorId(id)
                println("Edición encontrada: \$edicion")

                print("Nuevo título (dejar en blanco para no cambiar): ")
                val titulo = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva fecha de inicio (yyyy-MM-dd, dejar en blanco para no cambiar): ")
                val fechaInicio = scanner.nextLine().takeIf { it.isNotBlank() }?.let { LocalDate.parse(it) }
                print("Nueva fecha de fin (yyyy-MM-dd, dejar en blanco para no cambiar): ")
                val fechaFin = scanner.nextLine().takeIf { it.isNotBlank() }?.let { LocalDate.parse(it) }
                print("Nuevo estado (true/false, dejar en blanco para no cambiar): ")
                val estado = scanner.nextLine().takeIf { it.isNotBlank() }?.toBoolean()
                print("Nuevo curso ID (dejar en blanco para no cambiar): ")
                val cursoId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevos horarios (separados por comas, dejar en blanco para no cambiar): ")
                val horarios = scanner.nextLine().takeIf { it.isNotBlank() }?.split(",")?.map { it.trim() }
                print("Nuevos estudiantes (separados por comas, dejar en blanco para no cambiar): ")
                val estudiantes = scanner.nextLine().takeIf { it.isNotBlank() }?.split(",")?.map { it.trim() }

                if (confirmarAccion("¿Desea actualizar esta edición?")) {
                    val edicionActualizada = EdicionServices.actualizarEdicion(
                        id = id,
                        tituloEdicion = titulo,
                        fechaInicioEdicion = fechaInicio,
                        fechaFinEdicion = fechaFin,
                        estadoEdicion = estado,
                        cursoId = cursoId,
                        horarios = horarios,
                        estudiantes = estudiantes
                    )
                    println("Edición actualizada: \$edicionActualizada")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: \${e.message}")
            }
        }

        fun desactivarEdicion() {
            print("Ingrese el ID de la edición a desactivar: ")
            val id = scanner.nextLine()

            if (confirmarAccion("¿Desea desactivar esta edición?")) {
                try {
                    val edicionDesactivada = EdicionServices.desactivarEdicion(id)
                    println("Edición desactivada: \$edicionDesactivada")
                } catch (e: NoSuchElementException) {
                    println("Error: \${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }
    }
}