package com.example.fusdeckotlin.api.administrativo.comando

import com.example.fusdeckotlin.dto.administrativo.comando.CreateComandoDto
import com.example.fusdeckotlin.dto.administrativo.comando.UpdateComandoDto
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import retrofit2.Response
import retrofit2.http.*

interface ComandoApi {
    @GET("api/comandos")
    suspend fun getComandos(): Response<List<Comando>>

    @POST("api/comandos")
    suspend fun createComando (@Body req: CreateComandoDto): Response<Comando>

    @PUT("api/comandos/{id}")
    suspend fun updateComando(
        @Path("id") id: String,
        @Body req: UpdateComandoDto
    ): Response<Comando>

    @GET("api/comandos/{id}")
    suspend fun getComandoById(
        @Path("id") id: String
    ): Response<Comando>

    @DELETE("api/comandos/{id}")
    suspend fun  deleteComandoById(@Path("id") id: String): Response<Comando>

}