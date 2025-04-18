package com.example.fusdeckotlin.api.instructor.asistenciaestudiante

import com.example.fusdeckotlin.dto.instructor.asistenciaestudiante.AsistenciaEstudianteCreateRequest
import com.example.fusdeckotlin.models.instructor.asistenciaestudiante.AsistenciaEstudiante
import retrofit2.Response
import retrofit2.http.*

interface AsistenciaEstudianteApi {

    @GET("asistencia-estudiantes")
    suspend fun obtenerTodasLasRelaciones(): Response<List<AsistenciaEstudiante>>

    @POST("asistencia-estudiantes")
    suspend fun crearAsistenciaEstudiante(
        @Body request: AsistenciaEstudianteCreateRequest
    ): Response<AsistenciaEstudiante>

    @DELETE("asistencia-estudiantes/{asistenciaId}/{estudianteId}")
    suspend fun eliminarAsistenciaEstudiante(
        @Path("asistenciaId") asistenciaId: Int,
        @Path("estudianteId") estudianteId: String
    ): Response<Unit>
}