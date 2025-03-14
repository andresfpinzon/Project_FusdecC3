package com.example.fusdeckotlin

import com.example.fusdeckotlin.models.questions.Menu

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