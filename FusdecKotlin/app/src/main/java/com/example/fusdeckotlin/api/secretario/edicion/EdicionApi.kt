package com.example.fusdeckotlin.api.secretario.edicion

import com.example.fusdeckotlin.dto.secretario.edicion.ActualizarEdicionRequest
import com.example.fusdeckotlin.dto.secretario.edicion.CrearEdicionRequest
import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import retrofit2.Response
import retrofit2.http.*

interface EdicionApi {
    @GET("/ediciones")
    suspend fun listarEdicionesActivas(): Response<List<Edicion>>

    @POST("/ediciones")
    suspend fun crearEdicion(@Body request: CrearEdicionRequest): Response<Edicion>

    @PUT("/ediciones/{id}")
    suspend fun actualizarEdicion(
        @Path("id") id: String,
        @Body request: ActualizarEdicionRequest
    ): Response<Edicion>

    @DELETE("/ediciones/{id}")
    suspend fun desactivarEdicion(@Path("id") id: String): Response<Edicion>

    @GET("/ediciones/{id}")
    suspend fun obtenerEdicionPorId(@Path("id") id: String): Response<Edicion>
}