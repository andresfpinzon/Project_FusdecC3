package com.example.kotlinsql.dto

data class ComandoResponse(
    val id: Int,
    val nombreComando: String,
    val estadoComando: Boolean,
    val ubicacionComando: String,
    val fundacionNombre: String = "FUSDEC",
    val brigadas: List<String>?,
    val createdAt: String
)