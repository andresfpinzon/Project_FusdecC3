package com.example.fusdeckotlin.services.administrativo.colegio

import com.example.fusdeckotlin.api.administrativo.colegio.ColegioApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.colegio.ActualizarColegioRequest
import com.example.fusdeckotlin.dto.administrativo.colegio.CrearColegioRequest
import com.example.fusdeckotlin.models.administrativo.colegio.Colegio
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class ColegioServices {

    private val colegioApi: ColegioApi = RetrofitClient.colegioApi

    suspend fun crearColegio(
        nombre: String,
        email: String
    ): Result<Colegio> {
        return try {
            val request = CrearColegioRequest(
                nombre = nombre,
                email = email
            )

            val response = colegioApi.crearColegio(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarColegiosActivos(): Result<List<Colegio>> {
        return try {
            val response = colegioApi.listarColegiosActivos()
            handleListResponse(response) { it.filter { colegio -> colegio.getEstadoColegio() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerColegioPorId(id: Int): Result<Colegio> {
        return try {
            val response = colegioApi.obtenerColegioPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarColegio(
        id: Int,
        nombre: String? = null,
        email: String? = null,
        estado: Boolean? = null,
    ): Result<Colegio> {
        return try {
            val request = ActualizarColegioRequest(
                nombre = nombre,
                email = email,
                estado = estado,
            )

            val response = colegioApi.actualizarColegio(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarColegio(id: Int): Result<Colegio> {
        return try {
            val response = colegioApi.desactivarColegio(id)

            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Respuesta vacía del servidor"))
            } else {
                when (response.code()) {
                    404 -> Result.failure(Exception("Colegio no encontrado"))
                    else -> Result.failure(Exception("Error del servidor: ${response.code()}"))
                }
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}