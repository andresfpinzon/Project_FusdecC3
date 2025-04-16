package com.example.fusdeckotlin.api.secretario.estudiante

import com.example.fusdeckotlin.dto.secretario.estudiante.ActualizarEstudianteRequest
import com.example.fusdeckotlin.dto.secretario.estudiante.CrearEstudianteRequest
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import retrofit2.Response
import retrofit2.http.*

interface EstudianteApi {
    @GET("api/estudiantes")
    suspend fun listarEstudiantes(): Response<List<Estudiante>>

    @GET("api/estudiantes/{id}")
    suspend fun obtenerEstudiantePorId(@Path("id") id: String): Response<Estudiante>

    @POST("api/estudiantes")
    suspend fun crearEstudiante(@Body request: CrearEstudianteRequest): Response<Estudiante>

    @PUT("api/estudiantes/{id}")
    suspend fun actualizarEstudiante(
        @Path("id") id: String,
        @Body request: ActualizarEstudianteRequest
    ): Response<Estudiante>

    @DELETE("api/estudiantes/{id}")
    suspend fun desactivarEstudiante(@Path("id") id: String): Response<Estudiante>
}