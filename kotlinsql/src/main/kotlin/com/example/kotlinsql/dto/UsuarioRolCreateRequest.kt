package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern

data class UsuarioRolCreateRequest(
    @field:NotBlank(message = "El número de documento es obligatorio")
    val usuarioNumeroDocumento: String,

    @field:NotBlank(message = "El rol es obligatorio")
    @field:Pattern(regexp = "^(Administrativo|Instructor|Secretario|Root)$", message = "Rol no válido")
    val rol: String
)
