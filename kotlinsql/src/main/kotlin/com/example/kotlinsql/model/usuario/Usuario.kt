package com.example.kotlinsql.model.usuario

data class Usuario(
    val numeroDocumento: String,
    val nombre: String,
    val apellido: String,
    val correo: String,
    val password: String,
    val estado: Boolean = true,
    val createdAt: String?,
    val updatedAt: String?
)
