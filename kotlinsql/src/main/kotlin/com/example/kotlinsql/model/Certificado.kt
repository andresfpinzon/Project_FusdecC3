package com.example.kotlinsql.model

data class Certificado(
    val id: Int,
    val fechaEmision: String,
    val usuarioId: String,
    val estudianteId: String,
    val nombreEmisor: String,
    val codigoVerificacion: String,
    val estado: Boolean = true,
    val createdAt: String?
)
