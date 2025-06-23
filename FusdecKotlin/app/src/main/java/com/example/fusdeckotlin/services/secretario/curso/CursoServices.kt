package com.example.fusdeckotlin.services.secretario.curso

import com.example.fusdeckotlin.api.secretario.curso.CursoApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.secretario.curso.ActualizarCursoRequest
import com.example.fusdeckotlin.dto.secretario.curso.CrearCursoRequest
import com.example.fusdeckotlin.models.secretario.curso.Curso
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class CursoServices {

    private val cursoApi: CursoApi = RetrofitClient.cursoApi

    suspend fun crearCurso(
        nombre: String,
        descripcion: String,
        intensidadHoraria: String,
        fundacionId: Int
    ): Result<Curso> = withContext(Dispatchers.IO) {
        try {
            val request = CrearCursoRequest(
                nombre = nombre,
                descripcion = descripcion,
                intensidadHoraria = intensidadHoraria,
                fundacionId = fundacionId
            )

            val response = cursoApi.crearCurso(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarCursosActivos(): Result<List<Curso>> = withContext(Dispatchers.IO) {
        try {
            val response = cursoApi.listarCursosActivos()
            handleListResponse(response) { it.filter { curso -> curso.getEstado() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerCursoPorId(id: Int): Result<Curso> = withContext(Dispatchers.IO) {
        try {
            val response = cursoApi.obtenerCursoPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarCurso(
        id: Int,
        nombre: String? = null,
        descripcion: String? = null,
        intensidadHoraria: String? = null,
        fundacionId: Int? = null,
        estado: Boolean? = null
    ): Result<Curso> = withContext(Dispatchers.IO) {
        try {
            val request = ActualizarCursoRequest(
                nombre = nombre,
                descripcion = descripcion,
                intensidadHoraria = intensidadHoraria,
                fundacionId = fundacionId,
                estado = estado
            )

            val response = cursoApi.actualizarCurso(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarCurso(id: Int): Result<Curso> = withContext(Dispatchers.IO) {
        try {
            val response = cursoApi.desactivarCurso(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}