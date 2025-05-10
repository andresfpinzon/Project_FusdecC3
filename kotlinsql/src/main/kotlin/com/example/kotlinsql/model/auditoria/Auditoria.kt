package com.example.kotlinsql.model.auditoria

data class Auditoria(
    val id: Int,
    val fecha: String,
    val nombreEmisor: String,
    val certificadoId: Int,
    val estado: Boolean = true,
    val createdAt: String?
)
