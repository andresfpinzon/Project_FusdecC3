package com.example.fusdeckotlin.api.administrativo.unidad

import com.example.fusdeckotlin.dto.administrativo.unidad.CrearUnidadRequest
import com.example.fusdeckotlin.dto.administrativo.unidad.ActualizarUnidadRequest
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import retrofit2.Response
import retrofit2.http.*

interface UnidadApi {
    @GET("unidades")
    suspend fun listarUnidades(): Response<List<Unidad>>

    @POST("unidades")
    suspend fun crearUnidad(@Body data: CrearUnidadRequest): Response<Unidad>

    @PUT("unidades/{id}")
    suspend fun actualizarUnidad(
        @Path("id") id: Int,
        @Body data: ActualizarUnidadRequest
    ): Response<Unidad>

    @GET("unidades/{id}")
    suspend fun obtenerUnidadPorId(@Path("id") id: Int): Response<Unidad>

    @DELETE("unidades/{id}")
    suspend fun desactivarUnidad(@Path("id") id: Int): Response<Unidad>
}