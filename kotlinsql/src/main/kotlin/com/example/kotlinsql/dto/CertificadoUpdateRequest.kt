package com.example.kotlinsql.dto

data class CertificadoUpdateRequest(
    val fechaEmision: String? = null,
    val usuarioId: String? = null,
    val estudianteId: String? = null,
    val nombreEmisor: String? = null,
    val codigoVerificacion: String? = null,
    val estado: Int? = null
)
