package com.example.fusdeckotlin.api.auth

import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.models.auth.LoginRequest
import com.example.fusdeckotlin.models.auth.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("api/autenticaciones/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<LoginResponse>
}

object AuthService {
    suspend fun login(email: String, password: String): Response<LoginResponse> {
        return RetrofitClient.authApi.login(LoginRequest(email, password))
    }
}