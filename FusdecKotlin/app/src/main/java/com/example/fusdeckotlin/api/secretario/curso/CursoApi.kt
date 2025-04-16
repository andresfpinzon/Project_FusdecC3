package com.example.fusdeckotlin.api.secretario.curso

import com.example.fusdeckotlin.dto.secretario.curso.ActualizarCursoRequest
import com.example.fusdeckotlin.dto.secretario.curso.CrearCursoRequest
import com.example.fusdeckotlin.models.secretario.curso.Curso
import retrofit2.Response
import retrofit2.http.*

interface CursoApi {
    @GET("api/cursos")
    suspend fun listarCursosActivos(): Response<List<Curso>>

    @GET("api/cursos/{id}")
    suspend fun obtenerCursoPorId(@Path("id") id: String): Response<Curso>

    @POST("api/cursos")
    suspend fun crearCurso(@Body request: CrearCursoRequest): Response<Curso>

    @PUT("api/cursos/{id}")
    suspend fun actualizarCurso(
        @Path("id") id: String,
        @Body request: ActualizarCursoRequest
    ): Response<Curso>

    @DELETE("api/cursos/{id}")
    suspend fun desactivarCurso(@Path("id") id: String): Response<Curso>
}