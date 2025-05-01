package com.example.kotlinsql.dto

data class ComandoResponse(
    val id: Int,
    val nombreComando: String,
    val estadoComando: Boolean,
    val ubicacionComando: String,
    val fundacionNombre: String?,
    val brigadas: List<String>?
)