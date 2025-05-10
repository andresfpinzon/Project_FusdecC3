package com.example.kotlinsql.dto.colegio

import jakarta.validation.constraints.*

data class ColegioCreateRequest(
    @field:Size(min = 3, max = 100, message = "El nombre del colegio debe tener entre 3 y 100 caracteres")
    @field:NotBlank(message = "El nombre del colegio es obligatorio")
    val nombre: String,

    @field:Email(message = "El correo electrónico debe ser válido")
    @field:NotBlank(message = "El correo electrónico es obligatorio")
    val email: String
) {
    fun normalizar(): ColegioCreateRequest {
        return this.copy(
            nombre = this.nombre.lowercase().trim(),
            email = this.email.lowercase().trim()
        )
    }
}