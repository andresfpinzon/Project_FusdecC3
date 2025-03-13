package models.administrativo.auditoria

import models.administrativo.auditoria.implement.AuditoriaService
import models.administrativo.auditoria.model.AuditoriaModel
import models.administrativo.auditoria.services.AuditoriaController
import java.util.*

class DemoAuditoria {

    companion object {

        private val auditoriaServices = AuditoriaController(AuditoriaService())
        private val scanner = Scanner(System.`in`)

        fun ejecutarDemo() {
            var opcion: Int
            do {
                mostrarMenu()
                print("Seleccione una opción: ")
                opcion = scanner.nextInt()
                scanner.nextLine() // Consumir el salto de línea

                when (opcion) {
                    1 -> crearAuditoria()
                    2 -> actualizarAuditoria()
                    3 -> eliminarAuditoria()
                    4 -> obtenerAuditoriaPorId()
                    5 -> listarTodasLasAuditorias()
                    6 -> println("Saliendo del sistema...")
                    else -> println("Opción no válida. Intente de nuevo.")
                }
            } while (opcion != 6)
        }

        private fun mostrarMenu() {
            println("\n=== Menú de Auditorías ===")
            println("1. Crear Auditoría")
            println("2. Actualizar Auditoría")
            println("3. Eliminar Auditoría")
            println("4. Obtener Auditoría por ID")
            println("5. Listar Todas las Auditorías")
            println("6. Salir")
        }

        private fun crearAuditoria() {
            println("\n=== Crear Auditoría ===")
            print("ID de la auditoría: ")
            val id = scanner.nextLine()
            print("Fecha de auditoría (yyyy-MM-dd): ")
            val fechaStr = scanner.nextLine()
            val fecha = java.sql.Date.valueOf(fechaStr) // Convertir String a Date
            print("Nombre del emisor: ")
            val nombreEmisor = scanner.nextLine()
            print("ID del certificado: ")
            val certificadoId = scanner.nextLine()
            print("Estado de la auditoría (true/false): ")
            val estado = scanner.nextLine().toBoolean()

            val nuevaAuditoria = AuditoriaModel(
                _id = id,
                fechaAuditoria = fecha,
                nombreEmisor = nombreEmisor,
                certificadoId = certificadoId,
                estadoAuditoria = estado
            )

            try {
                val auditoriaCreada = auditoriaServices.registrarAuditoria(nuevaAuditoria)
                println("Auditoría creada: $auditoriaCreada")
            } catch (e: IllegalArgumentException) {
                println("Error: ${e.message}")
            }
        }

        private fun actualizarAuditoria() {
            println("\n=== Actualizar Auditoría ===")
            print("ID de la auditoría a actualizar: ")
            val id = scanner.nextLine()

            print("Nueva fecha de auditoría (yyyy-MM-dd): ")
            val fechaStr = scanner.nextLine()
            val fecha = java.sql.Date.valueOf(fechaStr)
            print("Nuevo nombre del emisor: ")
            val nombreEmisor = scanner.nextLine()
            print("Nuevo ID del certificado: ")
            val certificadoId = scanner.nextLine()
            print("Nuevo estado de la auditoría (true/false): ")
            val estado = scanner.nextLine().toBoolean()

            val auditoriaActualizada = AuditoriaModel(
                _id = id,
                fechaAuditoria = fecha,
                nombreEmisor = nombreEmisor,
                certificadoId = certificadoId,
                estadoAuditoria = estado
            )

            try {
                val auditoriaActualizadaResult = auditoriaServices.actualizarAuditoria(id, auditoriaActualizada)
                if (auditoriaActualizadaResult != null) {
                    println("Auditoría actualizada: $auditoriaActualizadaResult")
                } else {
                    println("Error: No se pudo actualizar la auditoría.")
                }
            } catch (e: IllegalArgumentException) {
                println("Error: ${e.message}")
            }
        }

        private fun eliminarAuditoria() {
            println("\n=== Eliminar Auditoría ===")
            print("ID de la auditoría a eliminar: ")
            val id = scanner.nextLine()

            try {
                val eliminada = auditoriaServices.eliminarAuditoria(id)
                if (eliminada) {
                    println("Auditoría eliminada correctamente.")
                } else {
                    println("Error: No se pudo eliminar la auditoría.")
                }
            } catch (e: IllegalArgumentException) {
                println("Error: ${e.message}")
            }
        }

        private fun obtenerAuditoriaPorId() {
            println("\n=== Obtener Auditoría por ID ===")
            print("ID de la auditoría: ")
            val id = scanner.nextLine()

            try {
                val auditoria = auditoriaServices.obtenerAuditoriaPorId(id)
                if (auditoria != null) {
                    println("Auditoría encontrada: $auditoria")
                } else {
                    println("Error: Auditoría no encontrada.")
                }
            } catch (e: IllegalArgumentException) {
                println("Error: ${e.message}")
            }
        }

        private fun listarTodasLasAuditorias() {
            println("\n=== Listar Todas las Auditorías ===")
            try {
                val auditorias = auditoriaServices.obtenerTodasLasAuditorias()
                if (auditorias.isEmpty()) {
                    println("No hay auditorías registradas.")
                } else {
                    auditorias.forEach { println(it) }
                }
            } catch (e: IllegalArgumentException) {
                println("Error: ${e.message}")
            }
        }
    }
}