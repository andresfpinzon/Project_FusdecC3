package models.administrativo.colegio

import java.util.Scanner

class ColegioController() {

    companion object {

        private val scanner = Scanner(System.`in`)

        private fun confirmarAccion(mensaje: String): Boolean {
            println("$mensaje (1: Sí, 2: No)")
            return scanner.nextLine() == "1"
        }

        fun crearColegio(colegios: MutableList<Colegio>) {
            println("Ingrese los datos del colegio:")
            print("ID: ")
            val id = scanner.next()
            print("Nombre: ")
            val nombre = scanner.next()
            print("Email: ")
            val email = scanner.next()
            print("Estudiantes (separados por comas): ")
            val estudiantes = scanner.next().split(",")

            if (confirmarAccion("¿Desea crear este colegio?")) {
                try {
                    val nuevoColegio = ColegioServicio.crearColegio(
                        colegios = colegios,
                        id = id,
                        nombreColegio = nombre,
                        emailColegio = email,
                        estudiantes = estudiantes
                    )
                    println("Colegio creado: $nuevoColegio")
                } catch (e: IllegalArgumentException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }

        fun listarColegiosActivos(colegios: List<Colegio>) {
            val colegiosActivos = ColegioServicio.listarColegiosActivos(colegios)
            if (colegiosActivos.isEmpty()) {
                println("No hay colegios activos.")
            } else {
                println("Colegios activos:")
                colegiosActivos.forEach { println(it) }
            }
        }

        fun actualizarColegio(colegios: MutableList<Colegio>) {
            print("Ingrese el ID del colegio a actualizar: ")
            val id = scanner.next()

            try {
                val colegio = ColegioServicio.obtenerColegioPorId(colegios, id)
                println("Colegio encontrado: $colegio")

                print("Nuevo nombre (dejar en blanco para no cambiar): ")
                val nombre = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo email (dejar en blanco para no cambiar): ")
                val email = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo estado (dejar en blanco para no cambiar): ")
                val estado = scanner.nextBoolean()
                print("Nuevos estudiantes (dejar en blanco para no cambiar): ")
                val estudiantes = scanner.nextLine().split(",").takeIf { it.isNotEmpty() }

                if (confirmarAccion("¿Desea actualizar este colegio?")) {
                    val colegioActualizado = ColegioServicio.actualizarColegio(
                        colegios = colegios,
                        id = id,
                        nombreColegio = nombre,
                        emailColegio = email,
                        estadoColegio = estado,
                        estudiantes = estudiantes
                    )
                    println("Colegio actualizado: $colegioActualizado")
                } else {
                    println("Operación cancelada.")
                }
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }

        fun desactivarColegio(colegios: MutableList<Colegio>) {
            println("Ingrese el ID del colegio a desactivar:")
            val id = scanner.next()
            try {
                val colegioDesactivado = ColegioServicio.desactivarColegio(colegios, id)
                println("Colegio desactivado: $colegioDesactivado")
            } catch (e: NoSuchElementException) {
                println("Error: ${e.message}")
            }
        }

    }
}