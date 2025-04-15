package com.example.fusdeckotlin.api.administrativo.user

import models.administrativo.user.model.Usuario
import retrofit2.http.*
import retrofit2.Response


interface IUserApi {

    @GET("api/usuarios")
    suspend fun getUsers(): Response<List<Usuario>>

}