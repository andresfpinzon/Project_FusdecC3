package com.example.kotlinsql.dto.curso

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import jakarta.validation.constraints.Positive

data class CursoCreateRequest(
    @field:Size(min = 3, max = 100, message = "El nombre del curso debe tener entre 3 y 100 caracteres")
    @field:NotBlank(message = "El nombre del curso es obligatorio")
    @field:Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]+\$", message = "El nombre solo puede contener letras, números y espacios")
    val nombre: String,

    @field:Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
    @field:NotBlank(message = "La descripción es obligatoria")
    val descripcion: String,

    @field:Pattern(regexp = "^[0-9]+ horas?\$", message = "La intensidad horaria debe estar en formato 'X horas'")
    @field:NotBlank(message = "La intensidad horaria es obligatoria")
    val intensidadHoraria: String,

    @field:NotNull(message = "El ID de la fundación es obligatorio")
    @field:Positive(message = "El ID de la fundación debe ser un número positivo")
    val fundacionId: Int
) {
    fun normalizar(): CursoCreateRequest {
        return this.copy(
            nombre = this.nombre.lowercase().trim(),
            descripcion = this.descripcion.lowercase().trim(),
            intensidadHoraria = this.intensidadHoraria.lowercase().trim()
        )
    }
}