package com.example.fusdeckotlin.api.administrativo.comando

import com.example.fusdeckotlin.dto.administrativo.comando.ActualizarComandoRequest
import com.example.fusdeckotlin.dto.administrativo.comando.CrearComandoRequest
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import retrofit2.Response
import retrofit2.http.*

interface ComandoApi {
    @GET("api/comandos")
    suspend fun listarComandos(): Response<List<Comando>>

    @POST("api/comandos")
    suspend fun crearComando(@Body request: CrearComandoRequest): Response<Comando>

    @PUT("api/comandos/{id}")
    suspend fun actualizarComando(
        @Path("id") id: String,
        @Body request: ActualizarComandoRequest
    ): Response<Comando>

    @DELETE("api/comandos/{id}")
    suspend fun desactivarComando(@Path("id") id: String): Response<Comando>

    @GET("api/comandos/{id}")
    suspend fun obtenerComandoPorId(@Path("id") id: String): Response<Comando>
}