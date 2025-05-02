package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern

data class UsuarioRolCreateRequest(
    @field:NotBlank(message = "El número de documento es obligatorio")
    val usuarioNumeroDocumento: String,

    @field:NotNull(message = "El ID del rol es obligatorio")
    val rolId: Int
)
