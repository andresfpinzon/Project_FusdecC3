package com.example.kotlinsql.dto.colegio

import jakarta.validation.constraints.*

data class ColegioUpdateRequest(
    @field:Size(min = 3, max = 100, message = "El nombre del colegio debe tener entre 3 y 100 caracteres")
    val nombre: String? = null,

    @field:Email(message = "El correo electrónico debe ser válido")
    val email: String? = null,

    val estado: Boolean? = null
) {
    fun normalizar(): ColegioUpdateRequest {
        return this.copy(
            nombre = this.nombre?.lowercase()?.trim(),
            email = this.email?.lowercase()?.trim()
        )
    }

    fun isEmpty(): Boolean {
        return nombre == null &&
                email == null &&
                estado == null
    }
}