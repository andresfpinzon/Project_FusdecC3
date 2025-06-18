package com.example.fusdeckotlin.api.administrativo.comando

import com.example.fusdeckotlin.dto.administrativo.comando.ActualizarComandoRequest
import com.example.fusdeckotlin.dto.administrativo.comando.CrearComandoRequest
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import retrofit2.Response
import retrofit2.http.*

interface ComandoApi {
    @GET("comandos")
    suspend fun listarComandos(): Response<List<Comando>>

    @POST("comandos")
    suspend fun crearComando(@Body request: CrearComandoRequest): Response<Comando>

    @PUT("comandos/{id}")
    suspend fun actualizarComando(
        @Path("id") id: Int,
        @Body request: ActualizarComandoRequest
    ): Response<Comando>

    @DELETE("comandos/{id}")
    suspend fun desactivarComando(@Path("id") id: Int): Response<Comando>

    @GET("comandos/{id}")
    suspend fun obtenerComandoPorId(@Path("id") id: Int): Response<Comando>
}