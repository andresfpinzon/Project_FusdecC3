package com.example.kotlinsql.dto

data class BrigadaResponse(
    val id: Int,
    val nombreBrigada: String,
    val ubicacionBrigada: String,
    val estadoBrigada: Boolean,
    val comandoNombre: String,
)