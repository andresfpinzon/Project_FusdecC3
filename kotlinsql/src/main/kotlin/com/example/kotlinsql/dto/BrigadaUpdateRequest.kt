package com.example.kotlinsql.dto

data class BrigadaUpdateRequest(
    val nombreBrigada: String? = null,
    val ubicacionBrigada: String? = null,
    val estadoBrigada: Boolean? = null,
    val comandoId: Int? = null,
)