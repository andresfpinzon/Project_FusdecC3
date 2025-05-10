package com.example.kotlinsql.dto.curso

import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size
import jakarta.validation.constraints.Positive

data class CursoUpdateRequest(
    @field:Size(min = 3, max = 100, message = "El nombre del curso debe tener entre 3 y 100 caracteres")
    @field:Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]*\$", message = "El nombre solo puede contener letras, números y espacios")
    val nombre: String? = null,

    @field:Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
    val descripcion: String? = null,

    @field:Pattern(regexp = "^[0-9]+ horas?\$", message = "La intensidad horaria debe estar en formato 'X horas'")
    val intensidadHoraria: String? = null,

    @field:Positive(message = "El ID de la fundación debe ser un número positivo")
    val fundacionId: Int? = null,

    val estado: Boolean? = null
) {
    fun normalizar(): CursoUpdateRequest {
        return this.copy(
            nombre = this.nombre?.lowercase()?.trim(),
            descripcion = this.descripcion?.lowercase()?.trim(),
            intensidadHoraria = this.intensidadHoraria?.lowercase()?.trim()
        )
    }

    fun isEmpty(): Boolean {
        return nombre == null &&
                descripcion == null &&
                intensidadHoraria == null &&
                fundacionId == null &&
                estado == null
    }
}