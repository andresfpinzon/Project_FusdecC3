package com.example.kotlinsql.dto.comando

import jakarta.validation.constraints.*

data class ComandoCreateRequest(
    @field:Size(min = 3, max = 50, message = "El nombre del comando debe tener entre 3 y 50 caracteres")
    @field:NotBlank(message = "El nombre del comando es obligatorio")
    val nombreComando: String,

    @field:NotBlank(message = "La ubicación del comando es obligatoria")
    val ubicacionComando: String,

    @field:NotNull(message = "El ID de la fundación es obligatorio")
    @field:Positive(message = "El ID de la fundación debe ser un número positivo")
    val fundacionId: Int
) {
    fun normalizar(): ComandoCreateRequest {
        return this.copy(
            nombreComando = this.nombreComando.lowercase().trim(),
            ubicacionComando = this.ubicacionComando.trim()
        )
    }
}