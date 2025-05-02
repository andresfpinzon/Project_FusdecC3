package com.example.kotlinsql.dto

data class ComandoUpdateRequest(
    val nombreComando: String? = null,
    val ubicacionComando: String? = null,
    val estadoComando: Boolean? = null,
    val fundacionId: Int? = null
)