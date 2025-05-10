package com.example.kotlinsql.dto.certificado

import jakarta.validation.constraints.*

data class CertificadoCreateRequest(
    @NotBlank(message = "La fecha de emisión es obligatoria (yyyy-MM-dd)")
    val fechaEmision: String,

    @NotBlank(message = "El ID del usuario es obligatorio")
    val usuarioId: String,

    @NotBlank(message = "El ID del estudiante es obligatorio")
    val estudianteId: String,

    @NotBlank(message = "El nombre del emisor es obligatorio")
    val nombreEmisor: String,

    @NotBlank(message = "El código de verificación es obligatorio")
    val codigoVerificacion: String
)

