package com.example.fusdeckotlin.api.administrativo.brigada

import com.example.fusdeckotlin.dto.administrativo.brigada.CrearBrigadaRequest
import com.example.fusdeckotlin.dto.administrativo.brigada.ActualizarBrigadaRequest
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import retrofit2.Response
import retrofit2.http.*

interface BrigadaApi {
    @GET("api/brigadas")
    suspend fun listarBrigadas(): Response<List<Brigada>>

    @POST("api/brigadas")
    suspend fun crearBrigada(@Body request: CrearBrigadaRequest): Response<Brigada>

    @PUT("api/brigadas/{id}")
    suspend fun actualizarBrigada(
        @Path("id") id: String,
        @Body request: ActualizarBrigadaRequest
    ): Response<Brigada>

    @DELETE("api/brigadas/{id}")
    suspend fun desactivarBrigada(@Path("id") id: String): Response<Brigada>

    @GET("api/brigadas/{id}")
    suspend fun obtenerBrigadaPorId(@Path("id") id: String): Response<Brigada>
}
