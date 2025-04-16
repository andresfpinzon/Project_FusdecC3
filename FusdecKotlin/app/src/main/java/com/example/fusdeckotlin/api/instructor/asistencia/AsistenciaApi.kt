package com.example.fusdeckotlin.api.instructor.asistencia

import com.example.fusdeckotlin.dto.instructor.asistencia.ActualizarAsistenciaRequest
import com.example.fusdeckotlin.dto.instructor.asistencia.CrearAsistenciaRequest
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import retrofit2.Response
import retrofit2.http.*

interface AsistenciaApi {
    @GET("api/asistencias")
    suspend fun listarAsistencias(): Response<List<Asistencia>>

    @POST("api/asistencias")
    suspend fun crearAsistencia(@Body request: CrearAsistenciaRequest): Response<Asistencia>

    @PUT("api/asistencias/{id}")
    suspend fun actualizarAsistencia(
        @Path("id") id: String,
        @Body request: ActualizarAsistenciaRequest
    ): Response<Asistencia>

    @DELETE("api/asistencias/{id}")
    suspend fun desactivarAsistencia(@Path("id") id: String): Response<Asistencia>

    @GET("api/asistencias/{id}")
    suspend fun obtenerAsistenciaPorId(@Path("id") id: String): Response<Asistencia>
}