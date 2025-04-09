package com.example.fusdeckotlin.api.instructor.calificacion

import com.example.fusdeckotlin.dto.instructor.calificacion.ActualizarCalificacionRequest
import com.example.fusdeckotlin.dto.instructor.calificacion.CrearCalificacionRequest
import com.example.fusdeckotlin.models.instructor.calificacion.Calificacion
import retrofit2.Response
import retrofit2.http.*

interface CalificacionApi {
    @GET("api/calificaciones")
    suspend fun listarCalificacionesActivas(): Response<List<Calificacion>>

    @POST("api/calificaciones")
    suspend fun crearCalificacion(@Body request: CrearCalificacionRequest): Response<Calificacion>

    @PUT("api/calificaciones/{id}")
    suspend fun actualizarCalificacion(
        @Path("id") id: String,
        @Body request: ActualizarCalificacionRequest
    ): Response<Calificacion>

    @DELETE("api/calificaciones/{id}")
    suspend fun desactivarCalificacion(@Path("id") id: String): Response<Calificacion>

    @GET("api/calificaciones/{id}")
    suspend fun obtenerCalificacionPorId(@Path("id") id: String): Response<Calificacion>
}