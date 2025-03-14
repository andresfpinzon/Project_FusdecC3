package models.administrativo.user.services

import models.administrativo.user.model.Usuario
import models.administrativo.user.repository.UsuarioRepository

class UsuarioServices(private val repository: UsuarioRepository) {

    fun registrarUsuario(usuario: Usuario): Result<Usuario>{
        // Verificar si ya existe un usuario con el mismo correo o documento
        repository.buscarPorCorreo(usuario.correo)?.let {
            return Result.failure(Exception("Ya existe un usuario con ese correo"))
        }

        repository.buscarPorNumeroDocumento(usuario.numeroDocumento)?.let {
            return Result.failure(Exception("Ya existe un usuario con ese número de documento"))
        }

        // Validar el correo electrónico
        if (!correoValido(usuario.correo)) {
            return Result.failure(Exception("El formato del correo electrónico no es válido"))
        }

        // Validar contraseña
        if (usuario.password.length < 8) {
            return Result.failure(Exception("La contraseña debe tener al menos 8 caracteres"))
        }

        // Si todo está bien, crear el usuario
        return Result.success(repository.crear(usuario))
    }


    fun actualizarUsuario(id: String, usuario: Usuario): Result<Usuario> {
        val usuarioExistente = repository.obtenerPorId(id) ?:
        return Result.failure(Exception("Usuario no encontrado"))

        // Si se cambia el correo, verificar que no exista ya
        if (usuario.correo != usuarioExistente.correo) {
            repository.buscarPorCorreo(usuario.correo)?.let {
                return Result.failure(Exception("Ya existe un usuario con ese correo"))
            }
        }

        // Si se cambia el número de documento, verificar que no exista ya
        if (usuario.numeroDocumento != usuarioExistente.numeroDocumento) {
            repository.buscarPorNumeroDocumento(usuario.numeroDocumento)?.let {
                return Result.failure(Exception("Ya existe un usuario con ese número de documento"))
            }
        }

        val usuarioActualizado = repository.actualizar(id, usuario)
            ?: return Result.failure(Exception("Error al actualizar usuario"))

        return Result.success(usuarioActualizado)
    }


    fun eliminarUsuario(id: String): Result<Boolean> {
        if (repository.obtenerPorId(id) == null) {
            return Result.failure(Exception("Usuario no encontrado"))
        }

        val eliminado = repository.eliminar(id)
        return if (eliminado) {
            Result.success(true)
        } else {
            Result.failure(Exception("Error al eliminar usuario"))
        }
    }


    fun obtenerUsuarioPorId(id: String): Result<Usuario> {
        val usuario = repository.obtenerPorId(id)
            ?: return Result.failure(Exception("Usuario no encontrado"))

        return Result.success(usuario)
    }

    fun listarUsuarios(): List<Usuario> {
        return repository.obtenerTodos()
    }

    fun buscarPorCorreo(correo: String): Result<Usuario> {
        val usuario = repository.buscarPorCorreo(correo)
            ?: return Result.failure(Exception("Usuario no encontrado"))

        return Result.success(usuario)
    }

    fun buscarPorDocumento(documento: String): Result<Usuario>{
        val usuario = repository.buscarPorNumeroDocumento(documento)
            ?: return Result.failure(Exception("Usuario no encontrado..."))

        return Result.success(usuario)
    }

    // Función para validar el formato del correo electrónico
    private fun correoValido(correo: String): Boolean {
        val emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
        return correo.matches(emailRegex.toRegex())
    }
}