package com.example.kotlinsql.model

data class Comando(
    val id: Int,
    val nombreComando: String,
    val estadoComando: Boolean = true,
    val ubicacionComando: String,
    val fundacionNombre: String
)