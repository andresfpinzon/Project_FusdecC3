package com.example.kotlinsql.dto

import jakarta.validation.constraints.*

/**
 * DTO para actualizar los datos de un usuario existente.
 * Todos los campos son opcionales, permitiendo actualizar solo los campos necesarios.
 */
data class UsuarioUpdateRequest(
    @field:Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    val nombre: String? = null,

    @field:Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    val apellido: String? = null,

    @field:Email(message = "El correo electrónico debe ser válido")
    @field:Size(max = 100, message = "El correo electrónico no puede exceder los 100 caracteres")
    val correo: String? = null,

    @field:Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    val password: String? = null,

    val estado: Boolean? = null
)