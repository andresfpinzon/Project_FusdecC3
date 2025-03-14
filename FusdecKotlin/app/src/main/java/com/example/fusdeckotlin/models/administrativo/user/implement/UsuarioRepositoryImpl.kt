package models.administrativo.user.implement

import models.administrativo.user.model.Usuario
import models.administrativo.user.repository.UsuarioRepository
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*

class UsuarioRepositoryImpl : UsuarioRepository {

    // Simulación de db con un mapa
    private val usuarioDB = mutableMapOf<String, Usuario>()

    init {
        // Inicializar la base de datos con los usuarios predefinidos
        agregarUsuariosIniciales()
    }

    private fun agregarUsuariosIniciales() {
        // Añadir los usuarios de ejemplo desde la clase Usuario
        val administrador = Usuario.administrador
        val secretario = Usuario.secretario
        val instructor = Usuario.instructor

        usuarioDB[administrador.id] = administrador
        usuarioDB[secretario.id] = secretario
        usuarioDB[instructor.id] = instructor
    }

    override fun crear(usuario: Usuario): Usuario {
        // Verificar si ya existe un usuario con el mismo correo o número de documento
        val existeCorreo = buscarPorCorreo(usuario.correo)
        val existeDocumento = buscarPorNumeroDocumento(usuario.numeroDocumento)

        if (existeCorreo != null) {
            throw IllegalArgumentException("Ya existe un usuario con el correo ${usuario.correo}")
        }

        if (existeDocumento != null) {
            throw IllegalArgumentException("Ya existe un usuario con el número de documento ${usuario.numeroDocumento}")
        }

        // Asignar un nuevo Id y fecha de creación actual
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        val ahora = LocalDateTime.now().format(formatter)
        val newId = UUID.randomUUID().toString() // Generar un ID único

        val newUsuario = usuario.copy(
            id = newId,
            creadoEn = ahora
        )
        usuarioDB[newId] = newUsuario
        return newUsuario
    }

    override fun obtenerPorId(id: String): Usuario? {
        return usuarioDB[id]
    }

    override fun obtenerTodos(): List<Usuario> {
        return usuarioDB.values.toList()
    }

    override fun actualizar(id: String, usuario: Usuario): Usuario? {
        if (!usuarioDB.containsKey(id)) {
            return null
        }

        // Verificar si el correo o documento ya existe en otro usuario
        val existeCorreo = buscarPorCorreo(usuario.correo)
        if (existeCorreo != null && existeCorreo.id != id) {
            throw IllegalArgumentException("Ya existe otro usuario con el correo ${usuario.correo}")
        }

        val existeDocumento = buscarPorNumeroDocumento(usuario.numeroDocumento)
        if (existeDocumento != null && existeDocumento.id != id) {
            throw IllegalArgumentException("Ya existe otro usuario con el número de documento ${usuario.numeroDocumento}")
        }

        // Mantener el Id original y la fecha de creación
        val usuarioActual = usuarioDB[id]!! // Fuerzo que no sea null
        val usuarioActualizado = usuario.copy(
            id = id,
            creadoEn = usuarioActual.creadoEn
        )

        usuarioDB[id] = usuarioActualizado
        return usuarioActualizado
    }

    override fun eliminar(id: String): Boolean {
        return usuarioDB.remove(id) != null
    }

    override fun buscarPorCorreo(correo: String): Usuario? {
        return usuarioDB.values.find { it.correo == correo }
    }

    override fun buscarPorNumeroDocumento(numeroDocumento: String): Usuario? {
        return usuarioDB.values.find { it.numeroDocumento == numeroDocumento }
    }
}