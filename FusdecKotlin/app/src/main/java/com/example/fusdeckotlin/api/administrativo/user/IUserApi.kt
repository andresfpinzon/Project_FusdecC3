package com.example.fusdeckotlin.api.administrativo.user

import com.example.fusdeckotlin.dto.administrativo.user.CreateUserDto
import com.example.fusdeckotlin.dto.administrativo.user.UpdateUserDto
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import retrofit2.http.*
import retrofit2.Response


interface IUserApi {

    @GET("api/usuarios")
    suspend fun getUsers(): Response<List<Usuario>>

    @POST("api/usuarios")
    suspend fun createUser(@Body data: CreateUserDto): Response<Usuario>

    @PUT("api/usuarios/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Body data: UpdateUserDto
    ): Response<Usuario>

    @GET("api/usuarios/{id}")
    suspend fun getUserById(@Path("id") id: String): Response<Usuario>

    @DELETE("api/usuarios/{id}")
    suspend fun deleteUserById(@Path("id") id: String): Response<Usuario>

}