package models.administrativo.user

import models.administrativo.user.implement.UsuarioRepositoryImpl
import models.administrativo.user.model.Usuario
import models.administrativo.user.services.UsuarioServices

class DemoUsuario {
    companion object {
        fun ejecutarDemoUsuario() {
            val usuarioRepository = UsuarioRepositoryImpl()
            val usuarioService = UsuarioServices(usuarioRepository)
            var continuar = true

            while (continuar) {
                mostrarMenu()
                val opcion = readLine()?.trim() ?: ""

                when (opcion) {
                    "1" -> listarUsuarios(usuarioService)
                    "2" -> crearNuevoUsuario(usuarioService)
                    "3" -> actualizarUsuarioExistente(usuarioService)
                    "4" -> eliminarUsuario(usuarioService)
                    "5" -> buscarUsuarioPorId(usuarioService)
                    "6" -> buscarUsuarioPorDocumento(usuarioService)
                    "7" -> buscarUsuarioPorCorreo(usuarioService)
                    "0" -> {
                        println("\n=== Demo Finalizada ===")
                        continuar = false
                    }
                    else -> println("Opción no válida. Intente de nuevo.")
                }
            }
        }

        private fun mostrarMenu() {
            println("\n=== SISTEMA DE GESTIÓN DE USUARIOS ===")
            println("1. Listar todos los usuarios")
            println("2. Crear nuevo usuario")
            println("3. Actualizar usuario existente")
            println("4. Eliminar usuario")
            println("5. Buscar usuario por ID")
            println("6. Buscar usuario por número de documento")
            println("7. Buscar usuario por correo")
            println("0. Salir")
            println("Seleccione una opción: ")
        }

        private fun listarUsuarios(usuarioService: UsuarioServices) {
            println("\n=== Lista de Usuarios ===")
            val usuarios = usuarioService.listarUsuarios()
            if (usuarios.isEmpty()) {
                println("No hay usuarios registrados.")
            } else {
                usuarios.forEach { imprimirUsuario(it) }
            }
        }

        private fun crearNuevoUsuario(usuarioService: UsuarioServices) {
            println("\n=== Crear Nuevo Usuario ===")

            println("Nombre:")
            val nombre = readLine() ?: ""

            println("Apellido:")
            val apellido = readLine() ?: ""

            println("Número de Documento:")
            val documento = readLine() ?: ""

            println("Correo:")
            val correo = readLine() ?: ""

            println("Contraseña:")
            val password = readLine() ?: ""

            println("Roles (separados por coma):")
            val rolesInput = readLine() ?: ""
            val roles = rolesInput.split(",").map { it.trim() }

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

            usuarioService.registrarUsuario(nuevoUsuario).fold(
                onSuccess = { usuario ->
                    println("\nUsuario creado exitosamente:")
                    imprimirUsuario(usuario)
                },
                onFailure = { error ->
                    println("\nError al crear usuario: ${error.message}")
                }
            )
        }

        private fun actualizarUsuarioExistente(usuarioService: UsuarioServices) {
            println("\n=== Actualizar Usuario Existente ===")

            println("Ingrese el ID del usuario a actualizar:")
            val idUsuario = readLine() ?: ""

            usuarioService.obtenerUsuarioPorId(idUsuario).fold(
                onSuccess = { usuario ->
                    println("\nUsuario encontrado:")
                    imprimirUsuario(usuario)

                    println("\n¿Qué desea actualizar?")
                    println("1. Nombre")
                    println("2. Apellido")
                    println("3. Correo")
                    println("4. Contraseña")
                    println("5. Añadir rol")
                    println("6. Estado de usuario")
                    println("0. Cancelar")

                    val opcionActualizar = readLine()?.trim() ?: "0"

                    if (opcionActualizar != "0") {
                        var usuarioActualizado = usuario

                        when (opcionActualizar) {
                            "1" -> {
                                println("Nuevo nombre:")
                                val nuevoNombre = readLine() ?: usuario.nombreUsuario
                                usuarioActualizado = usuarioActualizado.copy(nombreUsuario = nuevoNombre)
                            }
                            "2" -> {
                                println("Nuevo apellido:")
                                val nuevoApellido = readLine() ?: usuario.apellidoUsuario
                                usuarioActualizado = usuarioActualizado.copy(apellidoUsuario = nuevoApellido)
                            }
                            "3" -> {
                                println("Nuevo correo:")
                                val nuevoCorreo = readLine() ?: usuario.correo
                                usuarioActualizado = usuarioActualizado.copy(correo = nuevoCorreo)
                            }
                            "4" -> {
                                println("Nueva contraseña:")
                                val nuevaPassword = readLine() ?: usuario.password
                                usuarioActualizado = usuarioActualizado.copy(password = nuevaPassword)
                            }
                            "5" -> {
                                println("Nuevo rol a añadir:")
                                val nuevoRol = readLine() ?: ""
                                if (nuevoRol.isNotEmpty()) {
                                    usuarioActualizado = usuarioActualizado.copy(roles = usuario.roles + nuevoRol)
                                }
                            }
                            "6" -> {
                                println("Estado (activo=true, inactivo=false):")
                                val nuevoEstado = readLine()?.lowercase() == "true"
                                usuarioActualizado = usuarioActualizado.copy(estadoUsuario = nuevoEstado)
                            }
                            else -> println("Opción no válida.")
                        }

                        if (usuarioActualizado != usuario) {
                            usuarioService.actualizarUsuario(idUsuario, usuarioActualizado).fold(
                                onSuccess = { actualizado ->
                                    println("\nUsuario actualizado exitosamente:")
                                    imprimirUsuario(actualizado)
                                },
                                onFailure = { error ->
                                    println("\nError al actualizar usuario: ${error.message}")
                                }
                            )
                        }
                    }
                },
                onFailure = { error ->
                    println("\nError: ${error.message}")
                }
            )
        }

        private fun eliminarUsuario(usuarioService: UsuarioServices) {
            println("\n=== Eliminar Usuario ===")

            println("Ingrese el ID del usuario a eliminar:")
            val idUsuario = readLine() ?: ""

            println("¿Está seguro que desea eliminar el usuario con ID $idUsuario? (s/n)")
            val confirmar = readLine()?.lowercase() == "s"

            if (confirmar) {
                usuarioService.eliminarUsuario(idUsuario).fold(
                    onSuccess = { eliminado ->
                        if (eliminado) {
                            println("\nUsuario eliminado exitosamente.")
                        } else {
                            println("\nNo se pudo eliminar el usuario. Verifique el ID.")
                        }
                    },
                    onFailure = { error ->
                        println("\nError al eliminar usuario: ${error.message}")
                    }
                )
            } else {
                println("\nOperación cancelada.")
            }
        }

        private fun buscarUsuarioPorId(usuarioService: UsuarioServices) {
            println("\n=== Buscar Usuario por ID ===")

            println("Ingrese el ID del usuario:")
            val idUsuario = readLine() ?: ""

            usuarioService.obtenerUsuarioPorId(idUsuario).fold(
                onSuccess = { usuario ->
                    println("\nUsuario encontrado:")
                    imprimirUsuario(usuario)
                },
                onFailure = { error ->
                    println("\nError: ${error.message}")
                }
            )
        }

        private fun buscarUsuarioPorDocumento(usuarioService: UsuarioServices) {
            println("\n=== Buscar Usuario por Número de Documento ===")

            println("Ingrese el número de documento:")
            val documento = readLine() ?: ""

            usuarioService.buscarPorDocumento(documento).fold(
                onSuccess = { usuario ->
                    if (usuario != null) {
                        println("\nUsuario encontrado:")
                        imprimirUsuario(usuario)
                    } else {
                        println("\nNo se encontró usuario con el documento: $documento")
                    }
                },
                onFailure = { error ->
                    println("\nError: ${error.message}")
                }
            )
        }

        private fun buscarUsuarioPorCorreo(usuarioService: UsuarioServices) {
            println("\n=== Buscar Usuario por Correo ===")

            println("Ingrese el correo electrónico:")
            val correo = readLine() ?: ""

            usuarioService.buscarPorCorreo(correo).fold(
                onSuccess = { usuario ->
                    if (usuario != null) {
                        println("\nUsuario encontrado:")
                        imprimirUsuario(usuario)
                    } else {
                        println("\nNo se encontró usuario con el correo: $correo")
                    }
                },
                onFailure = { error ->
                    println("\nError: ${error.message}")
                }
            )
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
    }
}