package com.example.kotlinsql.model.comando

data class Comando(
    val id: Int,
    val nombreComando: String,
    val estadoComando: Boolean = true,
    val ubicacionComando: String,
    val fundacionId: Int
)