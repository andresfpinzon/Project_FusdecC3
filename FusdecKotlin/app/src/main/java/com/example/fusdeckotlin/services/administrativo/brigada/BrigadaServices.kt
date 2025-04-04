package com.example.fusdeckotlin.services.administrativo.brigada

import com.example.fusdeckotlin.api.administrativo.brigada.BrigadaApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.brigada.CrearBrigadaRequest
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import retrofit2.Response

class BrigadaServices {

    private val brigadaApi: BrigadaApi = RetrofitClient.brigadaApi

    suspend fun crearBrigada(
        nombreBrigada: String,
        ubicacionBrigada: String,
        estadoBrigada: Boolean = true,
        comandoId: String,
        unidades: List<String> = emptyList()
    ): Result<Brigada> {
        return try {
            val request = CrearBrigadaRequest.from(
                nombreBrigada = nombreBrigada,
                ubicacionBrigada = ubicacionBrigada,
                estadoBrigada = estadoBrigada,
                comandoId = comandoId,
                unidades = unidades
            )

            val response = brigadaApi.crearBrigada(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarBrigadasActivas(): Result<List<Brigada>> {
        return try {
            val response = brigadaApi.listarBrigadas()
            if (response.isSuccessful) {
                val brigadas = response.body()?.filter { it.getEstadoBrigada() } ?: emptyList()
                Result.success(brigadas)
            } else {
                Result.failure(Exception("Error del servidor: ${response.code()} - ${response.message()}"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarBrigada(
        id: String,
        nombreBrigada: String? = null,
        ubicacionBrigada: String? = null,
        estadoBrigada: Boolean? = null,
        comandoId: String? = null,
        unidades: List<String>? = null
    ): Result<Brigada> {
        return try {
            val currentResponse = brigadaApi.obtenerBrigadaPorId(id)
            if (!currentResponse.isSuccessful || currentResponse.body() == null) {
                return Result.failure(Exception("Brigada no encontrada"))
            }

            val brigadaActual = currentResponse.body()!!

            nombreBrigada?.let { brigadaActual.setNombreBrigada(it) }
            ubicacionBrigada?.let { brigadaActual.setUbicacionBrigada(it) }
            estadoBrigada?.let { brigadaActual.setEstadoBrigada(it) }
            comandoId?.let { brigadaActual.setComandoId(it) }
            unidades?.let { brigadaActual.setUnidades(it) }

            val request = CrearBrigadaRequest.from(
                brigadaActual.getNombreBrigada(),
                brigadaActual.getUbicacionBrigada(),
                brigadaActual.getEstadoBrigada(),
                brigadaActual.getComandoId(),
                brigadaActual.getUnidades()
            )

            val response = brigadaApi.actualizarBrigada(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarBrigada(id: String): Result<Brigada> {
        return try {
            val response = brigadaApi.desactivarBrigada(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private fun <T> handleResponse(response: Response<T>): Result<T> {
        return if (response.isSuccessful) {
            response.body()?.let {
                Result.success(it)
            } ?: Result.failure(Exception("Respuesta vacía del servidor"))
        } else {
            Result.failure(Exception("Error del servidor: ${response.code()} - ${response.message()}"))
        }
    }
}