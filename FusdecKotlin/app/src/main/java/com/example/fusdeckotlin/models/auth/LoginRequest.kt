package com.example.fusdeckotlin.models.auth

data class LoginRequest(
    val correo: String,
    val password: String
)