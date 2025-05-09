package com.example.kotlinsql.dto.unidad

import jakarta.validation.constraints.*

data class CreateUnidadDto(
    @field:Size(min = 3, max = 50, message = "El nombre de la unidad debe tener entre 3 y 50 caracteres")
    @field:NotBlank(message = "El nombre de la unidad es obligatorio")
    val nombreUnidad: String,

    @field:NotNull(message = "El ID de la brigada es obligatorio")
    @field:Positive(message = "El ID de la brigada debe ser un número positivo")
    val brigadaId: Int,

    @field:NotBlank(message = "El ID del usuario es obligatorio")
    val usuarioId: String
) {
    fun normalizar(): CreateUnidadDto {
        return this.copy(
            nombreUnidad = this.nombreUnidad.lowercase().trim(),
            usuarioId = this.usuarioId.trim()
        )
    }
}