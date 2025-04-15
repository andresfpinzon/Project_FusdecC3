package models.administrativo.user.repository

import models.administrativo.user.model.Usuario

interface UsuarioRepository {
    fun crear(usuario: Usuario): Usuario
    fun obtenerPorId(id: String): Usuario?
    fun obtenerTodos(): List<Usuario>
    fun actualizar(id: String, usuario: Usuario): Usuario?
    fun eliminar(id: String): Boolean
    fun buscarPorCorreo(correo: String): Usuario?
    fun buscarPorNumeroDocumento(numeroDocumento: String): Usuario?
}