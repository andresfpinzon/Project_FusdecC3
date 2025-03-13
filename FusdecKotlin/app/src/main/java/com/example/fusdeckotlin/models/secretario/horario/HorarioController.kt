package models.secretario.horario

import java.util.Scanner

class HorarioController {
    companion object {
        private val scanner = Scanner(System.`in`)

        private fun confirmarAccion(mensaje: String): Boolean {
            println("$mensaje (1: Sí, 2: No)")
            return scanner.nextLine() == "1"
        }

        fun crearHorario() {
            println("Ingrese los datos del horario:")
            print("Título: ")
            val tituloHorario = scanner.nextLine()
            print("Hora de inicio (HH:mm): ")
            val horaInicio = scanner.nextLine()
            print("Hora de fin (HH:mm): ")
            val horaFin = scanner.nextLine()

            if (confirmarAccion("¿Desea crear este horario?")) {
                try {
                    val nuevoHorario = HorarioServices.crearHorario(
                        tituloHorario = tituloHorario,
                        horaInicio = horaInicio,
                        horaFin = horaFin
                    )
                    println("Horario creado: $nuevoHorario")
                } catch (e: IllegalArgumentException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }

        fun listarHorarios() {
            val horarios = HorarioServices.listarHorarios()
            if (horarios.isEmpty()) {
                println("No hay horarios registrados.")
            } else {
                println("Horarios disponibles:")
                horarios.forEach { println(it) }
            }
        }

        fun actualizarHorario() {
            print("Ingrese el ID del horario a actualizar: ")
            val id = scanner.nextLine()

            try {
                val horario = HorarioServices.obtenerHorarioPorId(id)
                println("Horario encontrado: $horario")

                print("Nuevo título (dejar en blanco para no cambiar): ")
                val tituloHorario = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva hora de inicio (HH:mm, dejar en blanco para no cambiar): ")
                val horaInicio = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva hora de fin (HH:mm, dejar en blanco para no cambiar): ")
                val horaFin = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo estado (true/false, dejar en blanco para no cambiar): ")
                val estadoHorario = scanner.nextLine().takeIf { it.isNotBlank() }?.toBoolean()

                if (confirmarAccion("¿Desea actualizar este horario?")) {
                    val horarioActualizado = HorarioServices.actualizarHorario(
                        id = id,
                        tituloHorario = tituloHorario,
                        horaInicio = horaInicio,
                        horaFin = horaFin,
                        estadoHorario = estadoHorario
                    )
                    println("Horario actualizado: $horarioActualizado")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }

        fun desactivarHorario() {
            print("Ingrese el ID del horario a desactivar: ")
            val id = scanner.nextLine()

            if (confirmarAccion("¿Desea desactivar este horario?")) {
                try {
                    val horarioDesactivado = HorarioServices.desactivarHorario(id)
                    println("Horario desactivado: $horarioDesactivado")
                } catch (e: NoSuchElementException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }

        fun eliminarHorario() {
            print("Ingrese el ID del horario a eliminar: ")
            val id = scanner.nextLine()

            if (confirmarAccion("¿Desea eliminar este horario?")) {
                val eliminado = HorarioServices.eliminarHorario(id)
                if (eliminado) {
                    println("Horario eliminado correctamente.")
                } else {
                    println("No se encontró el horario con el ID proporcionado.")
                }
            } else {
                println("Operación cancelada.")
            }
        }
    }
}
