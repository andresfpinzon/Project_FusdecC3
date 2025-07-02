package com.example.fusdeckotlin.api.administrativo.brigada

import com.example.fusdeckotlin.dto.administrativo.brigada.CrearBrigadaRequest
import com.example.fusdeckotlin.dto.administrativo.brigada.ActualizarBrigadaRequest
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import retrofit2.Response
import retrofit2.http.*

interface BrigadaApi {
    @GET("brigadas")
    suspend fun listarBrigadas(): Response<List<Brigada>>

    @POST("brigadas")
    suspend fun crearBrigada(@Body request: CrearBrigadaRequest): Response<Brigada>

    @PUT("brigadas/{id}")
    suspend fun actualizarBrigada(
        @Path("id") id: Int,
        @Body request: ActualizarBrigadaRequest
    ): Response<Brigada>

    @DELETE("brigadas/{id}")
    suspend fun desactivarBrigada(@Path("id") id: Int): Response<Brigada>

    @GET("brigadas/{id}")
    suspend fun obtenerBrigadaPorId(@Path("id") id: Int): Response<Brigada>
}
