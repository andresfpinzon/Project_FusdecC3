package com.example.fusdeckotlin.api.secretario.estudiante

import com.example.fusdeckotlin.dto.secretario.estudiante.ActualizarEstudianteRequest
import com.example.fusdeckotlin.dto.secretario.estudiante.CrearEstudianteRequest
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import retrofit2.Response
import retrofit2.http.*

interface EstudianteApi {
    @GET("estudiantes")
    suspend fun listarEstudiantes(): Response<List<Estudiante>>

    @GET("estudiantes/{numeroDocumento}")
    suspend fun obtenerEstudiantePorDocumento(
        @Path("numeroDocumento") numeroDocumento: String
    ): Response<Estudiante>

    @POST("estudiantes")
    suspend fun crearEstudiante(@Body request: CrearEstudianteRequest): Response<Estudiante>

    @PUT("estudiantes/{numeroDocumento}")
    suspend fun actualizarEstudiante(
        @Path("numeroDocumento") numeroDocumento: String,
        @Body request: ActualizarEstudianteRequest
    ): Response<Estudiante>

    @DELETE("estudiantes/{numeroDocumento}")
    suspend fun desactivarEstudiante(
        @Path("numeroDocumento") numeroDocumento: String
    ): Response<Estudiante>
}