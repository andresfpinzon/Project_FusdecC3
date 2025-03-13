package models.secretario.estudiante


import java.util.*
import java.util.Scanner

class EstudianteController() {

    companion object {

        private val scanner = Scanner(System.`in`)

        private fun confirmarAccion(mensaje: String): Boolean {
            println("$mensaje (1: Sí, 2: No)")
            return scanner.nextLine() == "1"
        }

        fun crearEstudiante(estudiantes: MutableList<Estudiante>) {
            println("Ingrese los datos del estudiante:")
            print("ID: ")
            val id = scanner.next()
            print("Nombre: ")
            val nombre = scanner.next()
            print("Apellido: ")
            val apellido = scanner.next()
            print("Correo: ")
            val correo = scanner.next()
            print("Tipo de Documento: ")
            val tipoDocumento = scanner.next()
            print("Número de Documento: ")
            val numeroDocumento = scanner.next()
            print("Fecha de Nacimiento (yyyy-MM-dd): ")
            val fechaNacimiento = Date(scanner.next())
            print("Género: ")
            val genero = scanner.next()
            print("Unidad ID: ")
            val unidadId = scanner.next()
            print("Colegio ID: ")
            val colegioId = scanner.next()
            print("Estado del estudiante (true/false): ")
            val estadoEstudiante = scanner.nextBoolean()
            print("Ediciones (separadas por comas): ")
            val ediciones = scanner.next().split(",")
            print("Calificaciones (separadas por comas): ")
            val calificaciones = scanner.next().split(",")
            print("Asistencias (separadas por comas): ")
            val asistencias = scanner.next().split(",")
            print("Certificados (separados por comas): ")
            val certificados = scanner.next().split(",")

            if (confirmarAccion("¿Desea crear este estudiante?")){
                try {
                    val nuevoEstudiante = EstudianteServicio.crearEstudiante(
                        estudiantes = estudiantes,
                        id = id,
                        nombreEstudiante = nombre,
                        apellidoEstudiante = apellido,
                        correoEstudiante = correo,
                        tipoDocumento = tipoDocumento,
                        numeroDocumento = numeroDocumento,
                        fechaNacimiento = fechaNacimiento,
                        generoEstudiante = genero,
                        unidadId = unidadId,
                        colegioId = colegioId,
                        estadoEstudiante = estadoEstudiante,
                        ediciones = ediciones,
                        calificaciones = calificaciones,
                        asistencias = asistencias,
                        certificados = certificados
                    )
                    println("Estudiante creado: $nuevoEstudiante")
                } catch (e: IllegalArgumentException) {
                    println("Error: \${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }

        fun listarEstudiantes(estudiantes: List<Estudiante>) {
            if (estudiantes.isEmpty()) {
                println("No hay estudiantes registrados.")
            } else {
                println("Lista de estudiantes:")
                estudiantes.forEach { println(it) }
            }
        }

        fun actualizarEstudiante(estudiantes: MutableList<Estudiante>) {
            print("Ingrese el ID del estudiante a actualizar: ")
            val id = scanner.next()

            try {
                val estudiante = EstudianteServicio.obtenerEstudiantePorId(estudiantes, id)
                println("Estudiante encontrado: $estudiante")

                print("Nuevo nombre (dejar en blanco para no cambiar): ")
                val nombre = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo apellido (dejar en blanco para no cambiar): ")
                val apellido = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo correo (dejar en blanco para no cambiar): ")
                val correo = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo tipo de documento (dejar en blanco para no cambiar): ")
                val tipoDocumento = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo número de documento (dejar en blanco para no cambiar): ")
                val numeroDocumento = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva fecha de nacimiento (yyyy-MM-dd, dejar en blanco para no cambiar): ")
                val fechaNacimiento = scanner.nextLine().takeIf { it.isNotBlank() }?.let { Date(it) }
                print("Nuevo género (dejar en blanco para no cambiar): ")
                val genero = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva unidad ID (dejar en blanco para no cambiar): ")
                val unidadId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo colegio ID (dejar en blanco para no cambiar): ")
                val colegioId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo estado del estudiante (true/false, dejar en blanco para no cambiar): ")
                val estadoEstudiante = scanner.nextLine().takeIf { it.isNotBlank() }?.toBoolean()
                print("Nuevas ediciones (separadas por comas, dejar en blanco para no cambiar): ")
                val ediciones = scanner.nextLine().takeIf { it.isNotBlank() }?.split(",")
                print("Nuevas calificaciones (separadas por comas, dejar en blanco para no cambiar): ")
                val calificaciones = scanner.nextLine().takeIf { it.isNotBlank() }?.split(",")
                print("Nuevas asistencias (separadas por comas, dejar en blanco para no cambiar): ")
                val asistencias = scanner.nextLine().takeIf { it.isNotBlank() }?.split(",")
                print("Nuevos certificados (separados por comas, dejar en blanco para no cambiar): ")
                val certificados = scanner.nextLine().takeIf { it.isNotBlank() }?.split(",")

                if (confirmarAccion("¿Desea actualizar este estudiante?")){
                    val estudianteActualizado = EstudianteServicio.actualizarEstudiante(
                        estudiantes, id, nombre, apellido, correo, tipoDocumento, numeroDocumento, fechaNacimiento,
                        genero, unidadId, colegioId, estadoEstudiante, ediciones, calificaciones, asistencias, certificados
                    )
                    println("Estudiante actualizado: $estudianteActualizado")
                }else {
                    println("Operación cancelada.")
                }

            } catch (e: NoSuchElementException) {
                println("Error: \${e.message}")
            }
        }

        fun desactivarEstudiante(estudiantes: MutableList<Estudiante>) {
            print("Ingrese el ID del estudiante a desactivar: ")
            val id = scanner.next()
            if (confirmarAccion("¿Desea desactivar este estudiante?")){
                try {
                    val estudianteDesactivado = EstudianteServicio.desactivarEstudiante(estudiantes, id)
                    println("Estudiante desactivado: $estudianteDesactivado")
                } catch (e: NoSuchElementException) {
                    println("Error: \${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }
    }
}
