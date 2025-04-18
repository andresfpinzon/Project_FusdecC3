package com.example.fusdeckotlin.services.administrativo.comando

import com.example.fusdeckotlin.api.administrativo.comando.ComandoApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.comando.ActualizarComandoRequest
import com.example.fusdeckotlin.dto.administrativo.comando.CrearComandoRequest
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class ComandoServices {

    private val comandoApi: ComandoApi = RetrofitClient.comandoApi

    suspend fun crearComando(
        nombreComando: String,
        ubicacionComando: String,
        fundacionId: String
    ): Result<Comando> {
        return try {
            val request = CrearComandoRequest(
                nombreComando = nombreComando,
                ubicacionComando = ubicacionComando,
                fundacionId = fundacionId
            )

            val response = comandoApi.crearComando(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarComandosActivos(): Result<List<Comando>> {
        return try {
            val response = comandoApi.listarComandos()
            handleListResponse(response) { it.filter { comando -> comando.getEstadoComando() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerComandoPorId(id: String): Result<Comando> {
        return try {
            val response = comandoApi.obtenerComandoPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarComando(
        id: String,
        nombreComando: String? = null,
        ubicacionComando: String? = null,
        fundacionId: String? = null,
        estadoComando: Boolean? = null
    ): Result<Comando> {
        return try {
            val request = ActualizarComandoRequest(
                nombreComando = nombreComando,
                ubicacionComando = ubicacionComando,
                fundacionId = fundacionId,
                estadoComando = estadoComando
            )

            val response = comandoApi.actualizarComando(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarComando(id: String): Result<Comando> {
        return try {
            val response = comandoApi.desactivarComando(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}