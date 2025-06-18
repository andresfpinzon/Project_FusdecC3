package com.example.fusdeckotlin.services.administrativo.brigada

import com.example.fusdeckotlin.api.administrativo.brigada.BrigadaApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.brigada.CrearBrigadaRequest
import com.example.fusdeckotlin.dto.administrativo.brigada.ActualizarBrigadaRequest
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class BrigadaServices {

    private val brigadaApi: BrigadaApi = RetrofitClient.brigadaApi

    suspend fun crearBrigada(
        nombreBrigada: String,
        ubicacionBrigada: String,
        comandoId: Int
    ): Result<Brigada> {
        return try {
            val request = CrearBrigadaRequest(
                nombreBrigada = nombreBrigada,
                ubicacionBrigada = ubicacionBrigada,
                comandoId = comandoId
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
            handleListResponse(response) { it.filter { brigada -> brigada.getEstadoBrigada() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerBrigadaPorId(id: Int): Result<Brigada> {
        return try {
            val response = brigadaApi.obtenerBrigadaPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarBrigada(
        id: Int,
        nombreBrigada: String? = null,
        ubicacionBrigada: String? = null,
        comandoId: Int? = null,
        estadoBrigada: Boolean? = null
    ): Result<Brigada> {
        return try {
            val request = ActualizarBrigadaRequest(
                nombreBrigada = nombreBrigada,
                ubicacionBrigada = ubicacionBrigada,
                comandoId = comandoId,
                estadoBrigada = estadoBrigada
            )

            val response = brigadaApi.actualizarBrigada(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarBrigada(id: Int): Result<Brigada> {
        return try {
            val response = brigadaApi.desactivarBrigada(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
