package com.example.kotlinsql.model

data class Brigada(
    val id: Int,
    var nombreBrigada: String,
    var ubicacionBrigada: String,
    var estadoBrigada: Boolean = true,
    var comandoId: String
)