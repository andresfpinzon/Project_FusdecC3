package com.example.fusdeckotlin.services.instructor.calificacion

import com.example.fusdeckotlin.api.instructor.calificacion.CalificacionApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.instructor.calificacion.ActualizarCalificacionRequest
import com.example.fusdeckotlin.dto.instructor.calificacion.CrearCalificacionRequest
import com.example.fusdeckotlin.models.instructor.calificacion.Calificacion
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class CalificacionServices {

    private val calificacionApi: CalificacionApi = RetrofitClient.calificacionApi

    suspend fun crearCalificacion(
        titulo: String,
        aprobado: Boolean,
        usuarioId: String,
        estudiantes: List<String>
    ): Result<Calificacion> {
        return try {
            val request = CrearCalificacionRequest.from(
                titulo = titulo,
                aprobado = aprobado,
                usuarioId = usuarioId,
                estudiantes = estudiantes
            )

            val response = calificacionApi.crearCalificacion(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarCalificacionesActivas(): Result<List<Calificacion>> {
        return try {
            val response = calificacionApi.listarCalificacionesActivas()
            handleListResponse(response) { it.filter { calificacion -> calificacion.getEstadoCalificacion() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerCalificacionPorId(id: String): Result<Calificacion> {
        return try {
            val response = calificacionApi.obtenerCalificacionPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarCalificacion(
        id: String,
        tituloCalificacion: String? = null,
        aprobado: Boolean? = null,
        usuarioId: String? = null,
        estadoCalificacion: Boolean? = null,
        estudiantesIds: List<String>? = null
    ): Result<Calificacion> {
        return try {
            val request = ActualizarCalificacionRequest.from(
                titulo = tituloCalificacion,
                aprobado = aprobado,
                usuarioId = usuarioId,
                estado = estadoCalificacion,
                estudiantes = estudiantesIds
            )

            val response = calificacionApi.actualizarCalificacion(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarCalificacion(id: String): Result<Calificacion> {
        return try {
            val response = calificacionApi.desactivarCalificacion(id)

            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Respuesta vacía del servidor"))
            } else {
                when (response.code()) {
                    404 -> Result.failure(Exception("Calificación no encontrada"))
                    else -> Result.failure(Exception("Error del servidor: ${response.code()}"))
                }
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}