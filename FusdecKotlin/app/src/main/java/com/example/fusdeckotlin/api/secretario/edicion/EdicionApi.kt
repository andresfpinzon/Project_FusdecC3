package com.example.fusdeckotlin.api.secretario.edicion

import com.example.fusdeckotlin.dto.secretario.edicion.ActualizarEdicionRequest
import com.example.fusdeckotlin.dto.secretario.edicion.CrearEdicionRequest
import com.example.fusdeckotlin.dto.secretario.edicion.AgregarEstudianteRequest
import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import models.secretario.edicion.Edicion
import retrofit2.Response
import retrofit2.http.*

interface EdicionApi {
    @GET("api/ediciones")
    suspend fun listarEdicionesActivas(): Response<List<Edicion>>

    @POST("api/ediciones")
    suspend fun crearEdicion(@Body request: CrearEdicionRequest): Response<Edicion>

    @PUT("api/ediciones/{id}")
    suspend fun actualizarEdicion(
        @Path("id") id: String,
        @Body request: ActualizarEdicionRequest
    ): Response<Edicion>

    @DELETE("api/ediciones/{id}")
    suspend fun desactivarEdicion(@Path("id") id: String): Response<Edicion>

    @GET("api/ediciones/{id}")
    suspend fun obtenerEdicionPorId(@Path("id") id: String): Response<Edicion>

    @POST("api/ediciones/{id}/estudiantes")
    suspend fun agregarEstudianteAEdicion(
        @Path("id") id: String,
        @Body request: AgregarEstudianteRequest
    ): Response<Edicion>
}