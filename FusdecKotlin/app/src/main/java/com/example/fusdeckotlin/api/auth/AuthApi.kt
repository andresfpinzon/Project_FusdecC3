package com.example.fusdeckotlin.api.auth

import com.example.fusdeckotlin.models.auth.LoginRequest
import com.example.fusdeckotlin.models.auth.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("api/autenticaciones/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<LoginResponse>
}

