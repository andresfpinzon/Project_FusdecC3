package com.example.fusdeckotlin.api.secretario.curso

import com.example.fusdeckotlin.dto.secretario.curso.ActualizarCursoRequest
import com.example.fusdeckotlin.dto.secretario.curso.CrearCursoRequest
import com.example.fusdeckotlin.models.secretario.curso.Curso
import retrofit2.Response
import retrofit2.http.*

interface CursoApi {
    @GET("cursos")
    suspend fun listarCursosActivos(): Response<List<Curso>>

    @GET("cursos/{id}")
    suspend fun obtenerCursoPorId(@Path("id") id: Int): Response<Curso>

    @POST("cursos")
    suspend fun crearCurso(@Body request: CrearCursoRequest): Response<Curso>

    @PUT("cursos/{id}")
    suspend fun actualizarCurso(
        @Path("id") id: Int,
        @Body request: ActualizarCursoRequest
    ): Response<Curso>

    @DELETE("cursos/{id}")
    suspend fun desactivarCurso(@Path("id") id: Int): Response<Curso>
}