package com.example.kotlinsql.dto.edicion

import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import jakarta.validation.constraints.Positive

data class UpdateEdicionDto(
    @field:Size(min = 3, max = 100, message = "El título debe tener entre 3 y 100 caracteres")
    val titulo: String? = null,

    @field:Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}\$", message = "La fecha debe estar en formato YYYY-MM-DD")
    val fechaInicio: String? = null,

    @field:Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}\$", message = "La fecha debe estar en formato YYYY-MM-DD")
    val fechaFin: String? = null,

    @field:Positive(message = "El ID del curso debe ser un número positivo")
    val cursoId: Long? = null
) {
    fun normalizar(): UpdateEdicionDto {
        return this.copy(
            titulo = this.titulo?.lowercase()?.trim(),
            fechaInicio = this.fechaInicio?.trim(),
            fechaFin = this.fechaFin?.trim()
        )
    }

    fun isEmpty(): Boolean {
        return titulo == null &&
                fechaInicio == null &&
                fechaFin == null &&
                cursoId == null
    }
}