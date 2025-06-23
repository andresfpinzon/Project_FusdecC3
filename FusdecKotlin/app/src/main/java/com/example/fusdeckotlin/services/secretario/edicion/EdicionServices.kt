package com.example.fusdeckotlin.services.secretario.edicion

import com.example.fusdeckotlin.api.secretario.edicion.EdicionApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.secretario.edicion.ActualizarEdicionRequest
import com.example.fusdeckotlin.dto.secretario.edicion.CrearEdicionRequest
import com.example.fusdeckotlin.models.secretario.edicion.Edicion
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.LocalDate

class EdicionServices {

    private val edicionApi: EdicionApi = RetrofitClient.edicionApi

    suspend fun crearEdicion(
        nombre: String,
        fechaInicio: LocalDate,
        fechaFin: LocalDate,
        cursoId: Int?
    ): Result<Edicion> = withContext(Dispatchers.IO) {
        try {
            val request = CrearEdicionRequest(
                nombre = nombre,
                fechaInicio = fechaInicio.toString(),
                fechaFin = fechaFin.toString(),
                cursoId = cursoId
            )

            val response = edicionApi.crearEdicion(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarEdicionesActivas(): Result<List<Edicion>> = withContext(Dispatchers.IO) {
        try {
            val response = edicionApi.listarEdicionesActivas()
            handleListResponse(response) { it.filter { edicion -> edicion.getEstado() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerEdicionPorId(id: Long): Result<Edicion> = withContext(Dispatchers.IO) {
        try {
            val response = edicionApi.obtenerEdicionPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarEdicion(
        id: Long,
        nombre: String? = null,
        fechaInicio: LocalDate? = null,
        fechaFin: LocalDate? = null,
        cursoId: Int? = null,
        estado: Boolean? = null
    ): Result<Edicion> = withContext(Dispatchers.IO) {
        try {
            val request = ActualizarEdicionRequest(
                nombre = nombre,
                fechaInicio = fechaInicio?.toString(),
                fechaFin = fechaFin?.toString(),
                cursoId = cursoId,
                estado = estado
            )

            val response = edicionApi.actualizarEdicion(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarEdicion(id: Long): Result<Edicion> = withContext(Dispatchers.IO) {
        try {
            val response = edicionApi.desactivarEdicion(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}