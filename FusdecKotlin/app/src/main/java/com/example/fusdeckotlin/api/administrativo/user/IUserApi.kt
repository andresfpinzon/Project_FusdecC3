package com.example.fusdeckotlin.api.administrativo.user

import com.example.fusdeckotlin.dto.administrativo.user.CreateUserDto
import com.example.fusdeckotlin.dto.administrativo.user.UpdateUserDto
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario
import retrofit2.http.*
import retrofit2.Response


interface IUserApi {

    @GET("usuarios")
    suspend fun getUsers(): Response<List<Usuario>>

    @POST("usuarios")
    suspend fun createUser(@Body data: CreateUserDto): Response<Usuario>

    @PUT("usuarios/{numeroDocumento}")
    suspend fun updateUser(
        @Path("numeroDocumento") numeroDocumento: String,
        @Body data: UpdateUserDto
    ): Response<Usuario>


    @DELETE("usuarios/{numeroDocumento}")
    suspend fun deleteUserById(@Path("numeroDocumento") numeroDocumento: String): Response<Usuario>

    @GET("usuarios/numero-documento/{documento}")
    suspend fun getUserByDocument(@Path("documento") documento: String): Response<Usuario>

}