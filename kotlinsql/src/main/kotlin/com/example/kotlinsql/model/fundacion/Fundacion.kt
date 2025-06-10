package com.example.kotlinsql.model.fundacion

data class Fundacion(
    val id: Long,
    val nombre: String,
    val estado: Boolean = true
)
