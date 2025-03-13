package controllers.instructor.calificacion



import models.instructor.calificacion.Calificacion
import servicios.instructor.calificacion.CalificacionServicio
import java.util.Scanner

class CalificacionController() {

    companion object {

        private val scanner = Scanner(System.`in`)

        private fun confirmarAccion(mensaje: String): Boolean {
            println("$mensaje (1: Sí, 2: No)")
            return scanner.nextLine() == "1"
        }

        fun crearCalificacion(calificaciones: MutableList<Calificacion>) {
            println("Ingrese los datos de la calificación:")
            print("ID: ")
            val id = scanner.next()
            print("Título: ")
            val titulo = scanner.next()
            print("Aprobado (true/false): ")
            val aprobado = scanner.nextBoolean()
            print("Usuario ID: ")
            val usuarioId = scanner.next()
            print("Estudiantes (separados por comas): ")
            val estudiantes = scanner.next().split(",")

            if (confirmarAccion("¿Desea crear esta calificacion?")) {
                try {
                    val nuevaCalificacion = CalificacionServicio.crearCalificacion(
                        calificaciones = calificaciones,
                        id = id,
                        tituloCalificacion = titulo,
                        aprobado = aprobado,
                        usuarioId = usuarioId,
                        estudiantes = estudiantes
                    )
                    println("Calificación creada: $nuevaCalificacion")
                } catch (e: IllegalArgumentException) {
                    println("Error: \${e.message}")
                }
            }else {
                println("Operación cancelada.")
            }
        }

        fun listarCalificacionesActivas(calificaciones: List<Calificacion>) {
            val calificacionesActivas = CalificacionServicio.listarCalificacionesActivas(calificaciones)
            if (calificacionesActivas.isEmpty()) {
                println("No hay calificaciones activas.")
            } else {
                println("Calificaciones activas:")
                calificacionesActivas.forEach { println(it) }
            }
        }

        fun actualizarCalificacion(calificaciones: MutableList<Calificacion>) {
            print("Ingrese el ID de la calificación a actualizar: ")
            val id = scanner.next()

            try {
                val calificacion = CalificacionServicio.buscarCalificacionPorId(calificaciones, id)
                println("Calificación encontrada: $calificacion")

                print("Nuevo título (dejar en blanco para no cambiar): ")
                val titulo = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo estado de aprobación (true/false, dejar en blanco para no cambiar): ")
                val aprobado = scanner.nextLine().takeIf { it.isNotBlank() }?.toBoolean()
                print("Nuevo usuario ID (dejar en blanco para no cambiar): ")
                val usuarioId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevos estudiantes (separados por comas, dejar en blanco para no cambiar): ")
                val estudiantes = scanner.nextLine().takeIf { it.isNotBlank() }?.split(",")

                if (confirmarAccion("¿Desea actualizar esta calificacion?")) {
                    val calificacionActualizada = CalificacionServicio.actualizarCalificacion(
                        calificaciones = calificaciones,
                        id = id,
                        tituloCalificacion = titulo,
                        aprobado = aprobado,
                        usuarioId = usuarioId,
                        estudiantes = estudiantes
                    )
                    println("Calificación actualizada: $calificacionActualizada")
                }else {
                    println("Operación cancelada.")
                }

            } catch (e: NoSuchElementException) {
                println("Error: \${e.message}")
            }
        }

        fun desactivarCalificacion(calificaciones: MutableList<Calificacion>) {
            print("Ingrese el ID de la calificación a desactivar: ")
            val id = scanner.next()
            if (confirmarAccion("¿Desea desactivar esta caificacion?")){
                try {
                    val calificacionDesactivada = CalificacionServicio.desactivarCalificacion(calificaciones, id)
                    println("Calificación desactivada: $calificacionDesactivada")
                } catch (e: NoSuchElementException) {
                    println("Error: \${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }
    }
}
