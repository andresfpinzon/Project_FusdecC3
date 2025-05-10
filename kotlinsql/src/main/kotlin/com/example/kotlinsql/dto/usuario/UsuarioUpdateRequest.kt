package com.example.kotlinsql.dto.usuario

import jakarta.validation.constraints.*

data class UsuarioUpdateRequest(
    @field:Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @field:Pattern(regexp = "^[\\p{L} ]*\$", message = "El nombre solo puede contener letras y espacios")
    val nombre: String? = null,

    @field:Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @field:Pattern(regexp = "^[\\p{L} ]*\$", message = "El apellido solo puede contener letras y espacios")
    val apellido: String? = null,

    @field:Email(message = "El correo electrónico debe ser válido")
    @field:Size(max = 100, message = "El correo electrónico no puede exceder los 100 caracteres")
    val correo: String? = null,

    @field:Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    val password: String? = null,

    val estado: Boolean? = null
) {
    fun normalizar(): UsuarioUpdateRequest {
        return this.copy(
            nombre = this.nombre?.lowercase()?.trim(),
            apellido = this.apellido?.lowercase()?.trim(),
            correo = this.correo?.lowercase()?.trim()
        )
    }

    fun isEmpty(): Boolean {
        return nombre == null && apellido == null && correo == null && password == null && estado == null
    }
}