package models.questions
import models.administrativo.Usuario
import models.secretario.estudiante.Estudiante

import java.util.Date

class Acciones {

    companion object {

        val estudiantes = mutableListOf(Estudiante.estudiante1)

        fun comprobarEstado(usuario: Usuario): Boolean {
            val confirmarUsuario = ConfirmarUsuario()
            return confirmarUsuario.verificarEstado(usuario)
        }

        fun crearEstudiante(usuario: Usuario): Boolean {
            var rolPermitido = listOf("Secretario")
            val confirmarUsuario = ConfirmarUsuario()
            if (confirmarUsuario.verificarRol(usuario, rolPermitido)) {
                println("Ingrese los datos del estudiante")
                println("nombre:")
                val nombre = readln()
                println("apellido:")
                val apellido = readln()
                println("correo:")
                val correo = readln()
                println("genero:")
                val genero = readln()

                val nuevoEstudiante = Estudiante(
                    id = (estudiantes.size + 1).toString(),
                    nombreEstudiante = nombre,
                    apellidoEstudiante = apellido,
                    correoEstudiante = correo,
                    tipoDocumento = "C.C",
                    numeroDocumento = "123456789",
                    fechaNacimiento = Date(2005,4,10),
                    generoEstudiante = genero,
                    unidadId = "U001",
                    colegioId = "C001",
                    estadoEstudiante = true,
                    ediciones = listOf(),
                    calificaciones = listOf(),
                    asistencias = listOf(),
                    certificados = listOf()
                )

                estudiantes.add(nuevoEstudiante)
                println("Estudiante creado exitosamente.")
                return true
            } else {
                println("Lo sentimos, Usted no cuenta con el rol necesario para realizar la acción.")
                return false
            }
        }

        fun listarEstudiantes(usuario: Usuario) {
            val rolesPermitidos = listOf("Secretario", "Instructor")
            val confirmarUsuario = ConfirmarUsuario()

            if (confirmarUsuario.verificarRol(usuario, rolesPermitidos)) {
                if (estudiantes.isEmpty()) {
                    println("No hay estudiantes registrados.")
                } else {
                    println("Lista de estudiantes:")
                    estudiantes.forEach { estudiante ->
                        println("Nombre: ${estudiante.nombreEstudiante}, Apellido: ${estudiante.apellidoEstudiante}, Correo: ${estudiante.correoEstudiante}")
                    }
                }
            } else {
                println("Lo sentimos, Usted no cuenta con el rol necesario para realizar la acción.")
            }
        }

        fun login(usuarios: List<Usuario>): Usuario? {
            println("Ingrese su correo:")
            val correo: String = readln().lowercase()
            println("Ingrese su contraseña:")
            val password: String = readln().lowercase()

            val confirmarUsuario = ConfirmarUsuario()
            return usuarios.find { confirmarUsuario.verificarUsuario(correo, password, it) }
        }


        fun calificarEstudiantes() {
            val calificaciones = arrayOf(
                arrayOf(Estudiante.estudiante1, Estudiante.estudiante2, Estudiante.estudiante3),
                arrayOf(3, 5, 1)
            )

            for (i in calificaciones[0].indices) {
                val estudiante = calificaciones[0][i] as Estudiante
                val calificacion = calificaciones[1][i] as Int

                if (calificacion > 3) {
                    println("El estudiante ${estudiante.nombreEstudiante} aprobó con una nota de $calificacion")
                } else {
                    println("El estudiante ${estudiante.nombreEstudiante} no aprobó con una nota de $calificacion")
                }
            }
        }

        fun menuServicios(usuario: Usuario) {
            var salir = false
            while (!salir) {
                println("___________________________________________________________")
                println("Menú:")
                println("1. Crear Estudiante")
                println("2. Listar Estudiantes")
                println("3. Calificar Estudiantes")
                println("4. Salir")
                println("Seleccione una opción:")
                when (readln()) {
                    "1" -> crearEstudiante(usuario)
                    "2" -> listarEstudiantes(usuario)
                    "3" -> calificarEstudiantes()
                    "4" -> {
                        println("Saliendo del sistema")
                        salir = true
                    }
                    else -> println("Opción no válida, por favor intente de nuevo.")
                }
            }
        }

    }
}
