package com.example.kotlinsql.dto

data class BrigadaUpdateRequest(
    val nombreBrigada: String? = null,
    val ubicacionBrigada: String? = null,
    val estadoBrigada: Boolean? = null,
    val comandoNombre: String? = null,
    val unidadesNombres: List<String>? = null
)