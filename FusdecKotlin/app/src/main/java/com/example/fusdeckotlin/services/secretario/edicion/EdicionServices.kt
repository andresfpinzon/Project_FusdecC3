package com.example.fusdeckotlin.services.secretario.edicion

import com.example.fusdeckotlin.api.secretario.edicion.EdicionApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.secretario.edicion.ActualizarEdicionRequest
import com.example.fusdeckotlin.dto.secretario.edicion.CrearEdicionRequest
import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import java.time.LocalDate

class EdicionServices {

    private val edicionApi: EdicionApi = RetrofitClient.edicionApi

    suspend fun crearEdicion(
        nombre: String,
        fechaInicio: LocalDate,
        fechaFin: LocalDate,
        cursoId: String,
    ): Result<Edicion> {
        return try {
            val request = CrearEdicionRequest(
                nombre = nombre,
                fechaInicio = fechaInicio.toString(),
                fechaFin = fechaFin.toString(),
                cursoId = cursoId,
            )

            val response = edicionApi.crearEdicion(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarEdicionesActivas(): Result<List<Edicion>> {
        return try {
            val response = edicionApi.listarEdicionesActivas()
            handleListResponse(response) { it.filter { edicion -> edicion.getEstadoEdicion() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerEdicionPorId(id: String): Result<Edicion> {
        return try {
            val response = edicionApi.obtenerEdicionPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarEdicion(
        id: String,
        nombre: String? = null,
        fechaInicio: LocalDate? = null,
        fechaFin: LocalDate? = null,
        cursoId: String? = null,
        estado: Boolean? = null,
    ): Result<Edicion> {
        return try {
            val request = ActualizarEdicionRequest(
                nombre = nombre,
                fechaInicio = fechaInicio.toString(),
                fechaFin = fechaFin.toString(),
                cursoId = cursoId,
                estado = estado,
            )

            val response = edicionApi.actualizarEdicion(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarEdicion(id: String): Result<Edicion> {
        return try {
            val response = edicionApi.desactivarEdicion(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}