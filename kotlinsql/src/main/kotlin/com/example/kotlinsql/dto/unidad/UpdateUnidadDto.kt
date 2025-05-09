package com.example.kotlinsql.dto.unidad

import jakarta.validation.constraints.*

data class UpdateUnidadDto(
    @field:Size(min = 3, max = 50, message = "El nombre de la unidad debe tener entre 3 y 50 caracteres")
    val nombreUnidad: String? = null,

    @field:Positive(message = "El ID de la brigada debe ser un número positivo")
    val brigadaId: Int? = null,

    val usuarioId: String? = null
) {
    fun normalizar(): UpdateUnidadDto {
        return this.copy(
            nombreUnidad = this.nombreUnidad?.lowercase()?.trim(),
            usuarioId = this.usuarioId?.trim()
        )
    }

    fun isEmpty(): Boolean {
        return nombreUnidad == null &&
                brigadaId == null &&
                usuarioId == null
    }
}