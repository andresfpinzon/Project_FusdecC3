package models.administrativo

import models.administrativo.certificado.implement.CertificadoRepositoryImpl
import Certificado
import models.administrativo.certificado.services.CertificadoService
import models.administrativo.user.implement.UsuarioRepositoryImpl
import models.administrativo.user.model.Usuario
import models.administrativo.user.services.UsuarioServices
import java.sql.Date
import java.time.LocalDate
import java.util.*

class DemoCertificado {
    companion object {
        private lateinit var usuarioService: UsuarioServices
        private lateinit var certificadoService: CertificadoService
        private val scanner = Scanner(System.`in`)

        fun ejecutarDemo() {
            println("=== Iniciando Demo del Sistema Integrado ===")

            // Inicializar repositorios
            val usuarioRepository = UsuarioRepositoryImpl()
            val certificadoRepository = CertificadoRepositoryImpl()

            // Inicializar servicios
            usuarioService = UsuarioServices(usuarioRepository)
            certificadoService = CertificadoService(certificadoRepository, usuarioRepository)

            mostrarMenu()
        }

        private fun mostrarMenu() {
            var opcion: Int
            do {
                println("\n=== Menú Principal ===")
                println("1. Crear Usuario")
                println("2. Actualizar Usuario")
                println("3. Crear Certificado")
                println("4. Verificar Certificado")
                println("5. Revocar Certificado")
                println("6. Eliminar Certificado")
                println("7. Obtener Certificado por ID")
                println("8. Listar Certificados")
                println("9. Listar Certificados de un Estudiante")
                println("10. Listar Certificados de un Curso")
                println("11. Listar Usuarios")
                println("12. Salir")
                print("Seleccione una opción: ")
                opcion = scanner.nextInt()
                scanner.nextLine()  // Consumir el salto de línea

                when (opcion) {
                    1 -> crearUsuarioDesdeMenu()
                    2 -> actualizarUsuarioDesdeMenu()
                    3 -> crearCertificadoDesdeMenu()
                    4 -> verificarCertificadoDesdeMenu()
                    5 -> revocarCertificadoDesdeMenu()
                    6 -> eliminarCertificadoDesdeMenu()
                    7 -> obtenerCertificadoPorIdDesdeMenu()
                    8 -> listarCertificados()
                    9 -> listarCertificadosEstudianteDesdeMenu()
                    10 -> listarCertificadosCursoDesdeMenu()
                    11 -> listarUsuarios()
                    12 -> println("Saliendo del sistema...")
                    else -> println("Opción no válida. Intente de nuevo.")
                }
            } while (opcion != 12)
        }

        private fun crearUsuarioDesdeMenu() {
            println("\n=== Crear Usuario ===")
            print("Nombre: ")
            val nombre = scanner.nextLine()
            print("Apellido: ")
            val apellido = scanner.nextLine()
            print("Documento: ")
            val documento = scanner.nextLine()
            print("Correo: ")
            val correo = scanner.nextLine()
            print("Contraseña: ")
            val password = scanner.nextLine()
            print("Roles (separados por comas): ")
            val roles = scanner.nextLine().split(",").map { it.trim() }

            crearUsuario(usuarioService, nombre, apellido, documento, correo, password, roles)
        }

        private fun actualizarUsuarioDesdeMenu() {
            println("\n=== Actualizar Usuario ===")
            print("ID del Usuario a actualizar: ")
            val id = scanner.nextLine()
            print("Nuevo Nombre: ")
            val nombre = scanner.nextLine()
            print("Nuevo Apellido: ")
            val apellido = scanner.nextLine()
            print("Nuevo Documento: ")
            val documento = scanner.nextLine()
            print("Nuevo Correo: ")
            val correo = scanner.nextLine()
            print("Nuevos Roles (separados por comas): ")
            val roles = scanner.nextLine().split(",").map { it.trim() }

            val usuarioActualizado = Usuario(
                id = id,
                nombreUsuario = nombre,
                apellidoUsuario = apellido,
                numeroDocumento = documento,
                correo = correo,
                password = "",  // No se actualiza la contraseña en este ejemplo
                roles = roles,
                estadoUsuario = true,
                creadoEn = ""  // No se actualiza la fecha de creación
            )

            usuarioService.actualizarUsuario(id, usuarioActualizado).fold(
                onSuccess = { actualizado ->
                    println("Usuario actualizado:")
                    imprimirUsuario(actualizado)
                },
                onFailure = { error ->
                    println("Error: ${error.message}")
                }
            )
        }

        private fun crearCertificadoDesdeMenu() {
            println("\n=== Crear Certificado ===")
            print("ID del Usuario Emisor: ")
            val usuarioId = scanner.nextLine()
            print("ID del Curso: ")
            val cursoId = scanner.nextLine()
            print("ID del Estudiante: ")
            val estudianteId = scanner.nextLine()
            print("Nombre del Emisor: ")
            val emisor = scanner.nextLine()

            crearCertificado(certificadoService, usuarioId, cursoId, estudianteId, emisor)
        }

        private fun verificarCertificadoDesdeMenu() {
            println("\n=== Verificar Certificado ===")
            print("Código de Verificación: ")
            val codigo = scanner.nextLine()

            certificadoService.verificarCertificado(codigo).fold(
                onSuccess = { esValido ->
                    println("El certificado es ${if (esValido) "válido" else "inválido"}")
                },
                onFailure = { error ->
                    println("Error: ${error.message}")
                }
            )
        }

        private fun revocarCertificadoDesdeMenu() {
            println("\n=== Revocar Certificado ===")
            print("ID del Certificado a revocar: ")
            val id = scanner.nextLine()

            certificadoService.revocarCertificado(id).fold(
                onSuccess = { revocado ->
                    println("Certificado revocado:")
                    imprimirCertificado(revocado)
                },
                onFailure = { error ->
                    println("Error: ${error.message}")
                }
            )
        }

        private fun eliminarCertificadoDesdeMenu() {
            println("\n=== Eliminar Certificado ===")
            print("ID del Certificado a eliminar: ")
            val id = scanner.nextLine()

            certificadoService.eliminarCertificado(id).fold(
                onSuccess = { eliminado ->
                    if (eliminado) {
                        println("Certificado eliminado correctamente.")
                    } else {
                        println("No se pudo eliminar el certificado.")
                    }
                },
                onFailure = { error ->
                    println("Error: ${error.message}")
                }
            )
        }

        private fun obtenerCertificadoPorIdDesdeMenu() {
            println("\n=== Obtener Certificado por ID ===")
            print("ID del Certificado: ")
            val id = scanner.nextLine()

            certificadoService.obtenerCertificadoPorId(id).fold(
                onSuccess = { certificado ->
                    println("Certificado encontrado:")
                    imprimirCertificado(certificado)
                },
                onFailure = { error ->
                    println("Error: ${error.message}")
                }
            )
        }

        private fun listarCertificados() {
            println("\n=== Listar Certificados ===")
            val certificados = certificadoService.listarCertificados()
            if (certificados.isEmpty()) {
                println("No hay certificados registrados.")
            } else {
                certificados.forEach { imprimirCertificado(it) }
            }
        }

        private fun listarCertificadosEstudianteDesdeMenu() {
            println("\n=== Listar Certificados de un Estudiante ===")
            print("ID del Estudiante: ")
            val estudianteId = scanner.nextLine()

            val certificados = certificadoService.listarCertificadosEstudiante(estudianteId)
            if (certificados.isEmpty()) {
                println("No hay certificados para este estudiante.")
            } else {
                certificados.forEach { imprimirCertificado(it) }
            }
        }

        private fun listarCertificadosCursoDesdeMenu() {
            println("\n=== Listar Certificados de un Curso ===")
            print("ID del Curso: ")
            val cursoId = scanner.nextLine()

            val certificados = certificadoService.listarCertificadosCurso(cursoId)
            if (certificados.isEmpty()) {
                println("No hay certificados para este curso.")
            } else {
                certificados.forEach { imprimirCertificado(it) }
            }
        }

        private fun listarUsuarios() {
            println("\n=== Lista de Usuarios ===")
            val usuarios = usuarioService.listarUsuarios()
            usuarios.forEach { imprimirUsuario(it) }
        }

        private fun crearUsuario(
            service: UsuarioServices,
            nombre: String,
            apellido: String,
            documento: String,
            correo: String,
            password: String,
            roles: List<String>
        ): Usuario? {
            val nuevoUsuario = Usuario(
                id = "",  // Se generará automáticamente
                nombreUsuario = nombre,
                apellidoUsuario = apellido,
                numeroDocumento = documento,
                correo = correo,
                password = password,
                roles = roles,
                estadoUsuario = true,
                creadoEn = ""  // Se asignará automáticamente
            )

            var usuarioCreado: Usuario? = null
            service.registrarUsuario(nuevoUsuario).fold(
                onSuccess = { usuario ->
                    println("Usuario creado: ${usuario.nombreUsuario} ${usuario.apellidoUsuario}")
                    usuarioCreado = usuario
                },
                onFailure = { error ->
                    println("Error al crear usuario: ${error.message}")
                }
            )

            return usuarioCreado
        }

        private fun crearCertificado(
            service: CertificadoService,
            usuarioId: String,
            cursoId: String,
            estudianteId: String,
            emisor: String
        ): Certificado? {
            val fechaActual = Date.valueOf(LocalDate.now().toString())
            val codigo = "CERT-" + UUID.randomUUID().toString().substring(0, 8)

            val nuevoCertificado = Certificado(
                id = "",  // Se generará automáticamente
                fechaEmision = fechaActual,
                usuarioId = usuarioId,
                cursoId = cursoId,
                estudianteId = estudianteId,
                nombreEmisorCertificado = emisor,
                codigoVerificacion = codigo,
                estadoCertificado = true
            )

            var certificadoCreado: Certificado? = null
            service.emitirCertificado(nuevoCertificado).fold(
                onSuccess = { certificado ->
                    println("Certificado creado con código: ${certificado.codigoVerificacion}")
                    certificadoCreado = certificado
                },
                onFailure = { error ->
                    println("Error al crear certificado: ${error.message}")
                }
            )

            return certificadoCreado
        }

        private fun imprimirUsuario(usuario: Usuario) {
            println("---------------------------------")
            println("ID: ${usuario.id}")
            println("Nombre: ${usuario.nombreUsuario} ${usuario.apellidoUsuario}")
            println("Documento: ${usuario.numeroDocumento}")
            println("Correo: ${usuario.correo}")
            println("Roles: ${usuario.roles}")
            println("Estado: ${if (usuario.estadoUsuario) "Activo" else "Inactivo"}")
            println("Creado: ${usuario.creadoEn}")
            println("---------------------------------")
        }

        private fun imprimirCertificado(certificado: Certificado) {
            println("---------------------------------")
            println("ID: ${certificado.id}")
            println("Fecha Emisión: ${certificado.fechaEmision}")
            println("Usuario ID: ${certificado.usuarioId}")
            println("Curso ID: ${certificado.cursoId}")
            println("Estudiante ID: ${certificado.estudianteId}")
            println("Emisor: ${certificado.nombreEmisorCertificado}")
            println("Código Verificación: ${certificado.codigoVerificacion}")
            println("Estado: ${if (certificado.estadoCertificado) "Válido" else "Revocado"}")
            println("---------------------------------")
        }
    }
}