package com.example.fusdeckotlin.services.auth

import com.example.fusdeckotlin.models.auth.LoginRequest
import com.example.fusdeckotlin.models.auth.LoginResponse
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("api/autenticaciones/login")
    suspend fun login(@Body loginRequest: LoginRequest): Response<LoginResponse>
}

object AuthService {
    private val retrofit = Retrofit.Builder()
        .baseUrl("http://10.0.2.2:3000/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    private val authApi = retrofit.create(AuthApi::class.java)

    suspend fun login(email: String, password: String): Response<LoginResponse> {
        val loginRequest = LoginRequest(email, password)
        return authApi.login(loginRequest)
    }
}