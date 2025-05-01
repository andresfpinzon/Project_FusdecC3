package com.example.kotlinsql.model

import java.time.LocalDateTime

data class Brigada(
    val id: Int = 0,
    var nombreBrigada: String,
    var ubicacionBrigada: String,
    var estadoBrigada: Boolean = true,
    var comandoId: Int,
    var unidadIds: List<Int>? = null,
    val createdAt: LocalDateTime = LocalDateTime.now()
)