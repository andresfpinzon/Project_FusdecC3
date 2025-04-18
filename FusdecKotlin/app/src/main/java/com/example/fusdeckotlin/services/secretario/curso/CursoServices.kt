package com.example.fusdeckotlin.services.secretario.curso

import com.example.fusdeckotlin.api.secretario.curso.CursoApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.secretario.curso.ActualizarCursoRequest
import com.example.fusdeckotlin.dto.secretario.curso.CrearCursoRequest
import com.example.fusdeckotlin.models.secretario.curso.Curso
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class CursoServices {

    private val cursoApi: CursoApi = RetrofitClient.cursoApi

    suspend fun crearCurso(
        nombre: String,
        descripcion: String,
        intensidadHoraria: String,
        fundacionId: String,
    ): Result<Curso> {
        return try {
            val request = CrearCursoRequest(
                nombre = nombre,
                descripcion = descripcion,
                intensidadHoraria = intensidadHoraria,
                fundacionId = fundacionId,
            )

            val response = cursoApi.crearCurso(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarCursosActivos(): Result<List<Curso>> {
        return try {
            val response = cursoApi.listarCursosActivos()
            handleListResponse(response) { it.filter { curso -> curso.getEstadoCurso() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerCursoPorId(id: String): Result<Curso> {
        return try {
            val response = cursoApi.obtenerCursoPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarCurso(
        id: String,
        nombre: String? = null,
        descripcion: String? = null,
        intensidadHoraria: String? = null,
        estado: Boolean? = null,
        fundacionId: String? = null,
    ): Result<Curso> {
        return try {
            val request = ActualizarCursoRequest(
                nombre = nombre,
                descripcion = descripcion,
                intensidadHoraria = intensidadHoraria,
                fundacionId = fundacionId,
                estado = estado,
            )

            val response = cursoApi.actualizarCurso(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarCurso(id: String): Result<Curso> {
        return try {
            val response = cursoApi.desactivarCurso(id)

            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Respuesta vacía del servidor"))
            } else {
                when (response.code()) {
                    404 -> Result.failure(Exception("Curso no encontrado"))
                    else -> Result.failure(Exception("Error del servidor: ${response.code()}"))
                }
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}