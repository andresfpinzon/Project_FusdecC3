package com.example.kotlinsql.dto.brigada

import jakarta.validation.constraints.*

data class BrigadaCreateRequest(
    @field:Size(min = 3, max = 50, message = "El nombre de la brigada debe tener entre 3 y 100 caracteres")
    @field:NotBlank(message = "El nombre de la brigada es obligatorio")
    val nombreBrigada: String,

    @field:NotBlank(message = "La ubicación de la brigada es obligatoria")
    val ubicacionBrigada: String,

    @field:NotNull(message = "El ID del comando es obligatorio")
    @field:Positive(message = "El ID del comando debe ser un número positivo")
    val comandoId: Int
) {
    fun normalizar(): BrigadaCreateRequest {
        return this.copy(
            nombreBrigada = this.nombreBrigada.lowercase().trim(),
            ubicacionBrigada = this.ubicacionBrigada.trim()
        )
    }
}