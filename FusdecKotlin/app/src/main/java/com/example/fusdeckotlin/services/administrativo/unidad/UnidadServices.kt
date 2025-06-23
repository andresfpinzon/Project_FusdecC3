package com.example.fusdeckotlin.services.administrativo.unidad

import com.example.fusdeckotlin.api.administrativo.unidad.UnidadApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.unidad.ActualizarUnidadRequest
import com.example.fusdeckotlin.dto.administrativo.unidad.CrearUnidadRequest
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UnidadServices {

    private val unidadApi: UnidadApi = RetrofitClient.unidadApi

    suspend fun crearUnidad(
        nombreUnidad: String,
        brigadaId: Int,
        usuarioId: String
    ): Result<Unidad> = withContext(Dispatchers.IO) {
        try {
            val request = CrearUnidadRequest(
                nombreUnidad = nombreUnidad,
                brigadaId = brigadaId,
                usuarioId = usuarioId
            )

            val response = unidadApi.crearUnidad(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarUnidadesActivas(): Result<List<Unidad>> = withContext(Dispatchers.IO) {
        try {
            val response = unidadApi.listarUnidades()
            handleListResponse(response) { it.filter { unidad -> unidad.getEstadoUnidad() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerUnidadPorId(id: Int): Result<Unidad> = withContext(Dispatchers.IO) {
        try {
            val response = unidadApi.obtenerUnidadPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarUnidad(
        id: Int,
        nombreUnidad: String? = null,
        brigadaId: Int? = null,
        usuarioId: String? = null,
        estadoUnidad: Boolean? = null
    ): Result<Unidad> = withContext(Dispatchers.IO) {
        try {
            val request = ActualizarUnidadRequest(
                nombreUnidad = nombreUnidad,
                brigadaId = brigadaId,
                usuarioId = usuarioId,
                estadoUnidad = estadoUnidad
            )

            val response = unidadApi.actualizarUnidad(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarUnidad(id: Int): Result<Unidad> = withContext(Dispatchers.IO) {
        try {
            val response = unidadApi.desactivarUnidad(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}