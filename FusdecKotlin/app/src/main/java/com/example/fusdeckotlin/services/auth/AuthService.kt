package com.example.fusdeckotlin.services.auth

import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.models.auth.LoginRequest
import com.example.fusdeckotlin.models.auth.LoginResponse
import retrofit2.Response

object AuthService {
    suspend fun login(email: String, password: String): Response<LoginResponse> {
        return try {
            RetrofitClient.authApi.login(LoginRequest(email, password))
        } catch (e: Exception) {
            throw AuthException("Error de conexión: ${e.message}")
        }
    }
}

class AuthException(message: String) : Exception(message)