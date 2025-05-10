package com.example.kotlinsql.dto.auth

data class LoginRequest(
    val correo: String,
    val password: String
)