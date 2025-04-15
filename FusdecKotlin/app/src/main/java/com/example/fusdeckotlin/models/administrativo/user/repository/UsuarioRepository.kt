package models.administrativo.user.repository

import models.administrativo.user.model.UsuarioNOUse

interface UsuarioRepository {
    fun crear(usuarioNOUse: UsuarioNOUse): UsuarioNOUse
    fun obtenerPorId(id: String): UsuarioNOUse?
    fun obtenerTodos(): List<UsuarioNOUse>
    fun actualizar(id: String, usuarioNOUse: UsuarioNOUse): UsuarioNOUse?
    fun eliminar(id: String): Boolean
    fun buscarPorCorreo(correo: String): UsuarioNOUse?
    fun buscarPorNumeroDocumento(numeroDocumento: String): UsuarioNOUse?
}