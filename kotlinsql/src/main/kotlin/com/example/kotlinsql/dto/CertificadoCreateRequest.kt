package com.example.kotlinsql.dto

import jakarta.validation.constraints.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter

data class CertificadoCreateRequest(
    @field:NotBlank(message = "La fecha de emisión es obligatoria (yyyy-MM-dd)")
    @field:Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "La fecha debe estar en formato yyyy-MM-dd")
    val fechaEmision: String,

    @field:NotBlank(message = "El ID del usuario es obligatorio")
    val usuarioId: String,

    @field:NotBlank(message = "El ID del estudiante es obligatorio")
    val estudianteId: String,

    @field:NotBlank(message = "El nombre del emisor es obligatorio")
    val nombreEmisor: String,

    @field:NotBlank(message = "El código de verificación es obligatorio")
    val codigoVerificacion: String
) {
    init {
        try {
            LocalDate.parse(fechaEmision, DateTimeFormatter.ISO_DATE)
        } catch (e: Exception) {
            throw IllegalArgumentException("La fecha debe estar en formato yyyy-MM-dd")
        }
    }
}

