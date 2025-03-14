package models.secretario.curso

import java.util.Scanner

class CursoController {

    companion object {
        private val scanner = Scanner(System.`in`)

        private fun confirmarAccion(mensaje: String): Boolean {
            println("$mensaje (1: Sí, 2: No)")
            return scanner.nextLine() == "1"
        }

        fun crearCurso(cursos: MutableList<CursoModel>) {
            println("Ingrese los datos del curso:")
            print("ID: ")
            val id = scanner.nextLine()
            print("Nombre del curso: ")
            val nombreCurso = scanner.nextLine()
            print("Descripción del curso: ")
            val descripcionCurso = scanner.nextLine()
            print("Intensidad horaria del curso: ")
            val intensidadHorariaCurso = scanner.nextLine()
            print("Fundación ID: ")
            val fundacionId = scanner.nextLine()
            print("Ediciones (separadas por comas, opcional): ")
            val ediciones = scanner.nextLine().takeIf { it.isNotBlank() }?.split(",") ?: emptyList()

            if (confirmarAccion("¿Desea crear este curso?")) {
                try {
                    val nuevoCurso = CursoServices.crearCurso(
                        cursos = cursos,
                        id = id,
                        nombreCurso = nombreCurso,
                        descripcionCurso = descripcionCurso,
                        intensidadHorariaCurso = intensidadHorariaCurso,
                        fundacionId = fundacionId,
                        ediciones = ediciones
                    )
                    println("Curso creado: $nuevoCurso")
                } catch (e: IllegalArgumentException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }

        fun listarCursosActivos(cursos: List<CursoModel>) {
            val cursosActivos = CursoServices.listarCursosActivos(cursos)
            if (cursosActivos.isEmpty()) {
                println("No hay cursos activos.")
            } else {
                println("Cursos activos:")
                cursosActivos.forEach { println(it) }
            }
        }

        fun actualizarCurso(cursos: MutableList<CursoModel>) {
            print("Ingrese el ID del curso a actualizar: ")
            val id = scanner.nextLine()

            try {
                val curso = CursoServices.obtenerCursoPorId(cursos, id)
                println("Curso encontrado: $curso")

                print("Nuevo nombre del curso (dejar en blanco para no cambiar): ")
                val nombreCurso = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva descripción (dejar en blanco para no cambiar): ")
                val descripcionCurso = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva intensidad horaria (dejar en blanco para no cambiar): ")
                val intensidadHorariaCurso = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo estado del curso (1: Activo, 2: Inactivo, dejar en blanco para no cambiar): ")
                val estadoCurso = scanner.nextLine().takeIf { it.isNotBlank() }?.let { it == "1" }

                if (confirmarAccion("¿Desea actualizar este curso?")) {
                    val cursoActualizado = CursoServices.actualizarCurso(
                        cursos = cursos,
                        id = id,
                        nombreCurso = nombreCurso,
                        descripcionCurso = descripcionCurso,
                        intensidadHorariaCurso = intensidadHorariaCurso,
                        estadoCurso = estadoCurso
                    )
                    println("Curso actualizado: $cursoActualizado")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }

        fun desactivarCurso(cursos: MutableList<CursoModel>) {
            print("Ingrese el ID del curso a desactivar: ")
            val id = scanner.nextLine()

            if (confirmarAccion("¿Desea desactivar este curso?")) {
                try {
                    val cursoDesactivado = CursoServices.desactivarCurso(cursos, id)
                    println("Curso desactivado: $cursoDesactivado")
                } catch (e: NoSuchElementException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }
    }
}