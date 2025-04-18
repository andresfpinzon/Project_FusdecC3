package com.example.fusdeckotlin.api.administrativo.unidad

import com.example.fusdeckotlin.dto.administrativo.unidad.CrearUnidadRequest
import com.example.fusdeckotlin.dto.administrativo.unidad.ActualizarUnidadRequest
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import retrofit2.Response
import retrofit2.http.*

interface UnidadApi {
    @GET("api/unidades")
    suspend fun listarUnidades(): Response<List<Unidad>>

    @POST("api/unidades")
    suspend fun crearUnidad(@Body data: CrearUnidadRequest): Response<Unidad>

    @PUT("api/unidades/{id}")
    suspend fun actualizarUnidad(
        @Path("id") id: String, 
        @Body data: ActualizarUnidadRequest
    ): Response<Unidad>

    @GET("api/unidades/{id}")
    suspend fun obtenerUnidadPorId(@Path("id") id: String): Response<Unidad>

    @DELETE("api/unidades/{id}")
    suspend fun desactivarUnidad(@Path("id") id: String): Response<Unidad>
}