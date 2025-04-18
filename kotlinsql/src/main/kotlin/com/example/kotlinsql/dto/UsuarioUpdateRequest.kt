package com.example.kotlinsql.dto

import jakarta.validation.constraints.*

data class UsuarioUpdateRequest(
    val nombre: String? = null,
    val apellido: String? = null,
    @field:Email val correo: String? = null,
    @field:Size(min = 6) val password: String? = null,
    val estado: Boolean? = null
)


