package com.example.kotlinsql.dto.edicion

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import jakarta.validation.constraints.Positive

data class CreateEdicionDto(
    @field:Size(min = 3, max = 100, message = "El título debe tener entre 3 y 100 caracteres")
    @field:NotBlank(message = "El título es obligatorio")
    val titulo: String,

    @field:NotBlank(message = "La fecha de inicio es obligatoria")
    @field:Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}\$", message = "La fecha debe estar en formato YYYY-MM-DD")
    val fechaInicio: String,

    @field:NotBlank(message = "La fecha de fin es obligatoria")
    @field:Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}\$", message = "La fecha debe estar en formato YYYY-MM-DD")
    val fechaFin: String,

    @field:NotNull(message = "El ID del curso es obligatorio")
    @field:Positive(message = "El ID del curso debe ser un número positivo")
    val cursoId: Long
) {
    fun normalizar(): CreateEdicionDto {
        return this.copy(
            titulo = this.titulo.lowercase().trim(),
            fechaInicio = this.fechaInicio.trim(),
            fechaFin = this.fechaFin.trim()
        )
    }
}