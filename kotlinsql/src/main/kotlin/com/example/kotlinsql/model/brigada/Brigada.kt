package com.example.kotlinsql.model.brigada

data class Brigada(
    val id: Int,
    var nombreBrigada: String,
    var ubicacionBrigada: String,
    var estadoBrigada: Boolean = true,
    var comandoId: Int
)