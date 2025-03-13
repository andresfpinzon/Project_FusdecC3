package models.questions
import models.administrativo.Usuario

class ConfirmarUsuario() {

    fun verificarEstado(usuario: Usuario): Boolean {
        return usuario.estadoUsuario
    }

    fun verificarRol(usuario: Usuario, rolesPermitidos: List<String>): Boolean {
        return usuario.roles.any { it in rolesPermitidos }
    }

    fun verificarUsuario(correo: String, password: String, usuario: Usuario): Boolean {
        return correo == usuario.correo && password == usuario.password
    }
}