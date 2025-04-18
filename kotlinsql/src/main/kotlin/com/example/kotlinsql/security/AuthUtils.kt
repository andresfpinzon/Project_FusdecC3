package com.example.kotlinsql.security

import jakarta.servlet.http.HttpServletRequest

fun verificarRol(request: HttpServletRequest, rolesPermitidos: List<String>): Boolean {
    val roles = request.getAttribute("roles") as? List<*> ?: return false
    return rolesPermitidos.any { roles.contains(it) }
}
