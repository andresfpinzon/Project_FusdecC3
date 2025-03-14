package models.administrativo.unidad

import java.util.Scanner

class UnidadController() {

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
            print("Estudiantes (separados por comas): ")
            val estudiantes = scanner.next().split(",")

            if (confirmarAccion("¿Desea crear esta unidad?")) {
                try {
                    val nuevaUnidad = UnidadServicio.crearUnidad(
                        unidades = unidades,
                        id = id,
                        nombreUnidad = nombre,
                        brigadaId = brigadaId,
                        usuarioId = usuarioId,
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
            val unidadesActivas = UnidadServicio.listarUnidadesActivas(unidades)
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
                val unidad = UnidadServicio.obtenerUnidadPorId(unidades, id)
                println("Unidad encontrada: $unidad")

                print("Nuevo nombre (dejar en blanco para no cambiar): ")
                val nombre = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nueva brigada ID (dejar en blanco para no cambiar): ")
                val brigadaId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevo usuario ID (dejar en blanco para no cambiar): ")
                val usuarioId = scanner.nextLine().takeIf { it.isNotBlank() }
                print("Nuevos estudiantes (dejar en blanco para no cambiar): ")
                val estudiantes = scanner.next().split(",").takeIf { it.isNotEmpty() }

                if (confirmarAccion("¿Desea actualizar esta unidad?")) {
                    val unidadActualizada = UnidadServicio.actualizarUnidad(
                        unidades = unidades,
                        id = id,
                        nombreUnidad = nombre,
                        brigadaId = brigadaId,
                        usuarioId = usuarioId,
                        estudiantes = estudiantes
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

            if (confirmarAccion("¿Desea desactivar esta unidad?")) {
                try {
                    val unidadDesactivada = UnidadServicio.desactivarUnidad(unidades, id)
                    println("Unidad desactivada: $unidadDesactivada")
                } catch (e: NoSuchElementException) {
                    println("Error: ${e.message}")
                }
            } else {
                println("Operación cancelada.")
            }
        }
    }
}