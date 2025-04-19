package models.questions
import models.administrativo.UsuarioNoUsar

class ConfirmarUsuario() {

    fun verificarEstado(usuarioNoUsar: UsuarioNoUsar): Boolean {
        return usuarioNoUsar.estadoUsuario
    }

    fun verificarRol(usuarioNoUsar: UsuarioNoUsar, rolesPermitidos: List<String>): Boolean {
        return usuarioNoUsar.roles.any { it in rolesPermitidos }
    }

    fun verificarUsuario(correo: String, password: String, usuarioNoUsar: UsuarioNoUsar): Boolean {
        return correo == usuarioNoUsar.correo && password == usuarioNoUsar.password
    }
}