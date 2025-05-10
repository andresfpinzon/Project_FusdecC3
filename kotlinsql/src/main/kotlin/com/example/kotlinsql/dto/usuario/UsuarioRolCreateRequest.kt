package com.example.kotlinsql.dto.usuario

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class UsuarioRolCreateRequest(
    @field:NotBlank(message = "El número de documento es obligatorio")
    val usuarioNumeroDocumento: String,

    @field:NotNull(message = "El ID del rol es obligatorio")
    val rolId: Int
)
