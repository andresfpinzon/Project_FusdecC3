package com.example.fusdecmovil

import models.administrativo.Usuario
import models.administrativo.auditoria.DemoAuditoria
import models.questions.*

fun main() {

//    val usuarios = listOf(Usuario.instructor, Usuario.secretario, Usuario.administrador)
//
//    println("___________________________________________________________")
//    val usuarioLogeado = Acciones.login(usuarios)
//
//    if (usuarioLogeado != null) {
//        println("Ingreso satisfactorio.")
//        if (Acciones.comprobarEstado(usuarioLogeado)) {
//            println("Hola ${usuarioLogeado.nombreUsuario} su estado es Activo, Puede ingresar al programa.")
//            Acciones.menuServicios(usuarioLogeado)
//        } else {
//            println("Usuario inactivo, comunicarse con administración para solucionar el problema.")
//        }
//    } else {
//        println("Correo o contraseña incorrectos, intentelo nuevamente.")
//    }
    Menu.accederServicios()
}