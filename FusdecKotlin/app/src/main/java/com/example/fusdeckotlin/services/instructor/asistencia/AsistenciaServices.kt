package com.example.fusdeckotlin.services.instructor.asistencia

import com.example.fusdeckotlin.api.instructor.asistencia.AsistenciaApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.instructor.asistencia.ActualizarAsistenciaRequest
import com.example.fusdeckotlin.dto.instructor.asistencia.CrearAsistenciaRequest
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import java.time.LocalDate

class AsistenciaServices {

    private val asistenciaApi: AsistenciaApi = RetrofitClient.asistenciaApi

    suspend fun crearAsistencia(
        titulo: String,
        fecha: LocalDate,
        usuarioId: String,
        estudiantes: List<String>
    ): Result<Asistencia> {
        return try {
            val request = CrearAsistenciaRequest.from(
                titulo = titulo,
                fecha = fecha,
                usuarioId = usuarioId,
                estudiantes = estudiantes
            )

            val response = asistenciaApi.crearAsistencia(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarAsistenciasActivas(): Result<List<Asistencia>> {
        return try {
            val response = asistenciaApi.listarAsistencias()
            handleListResponse(response) { it.filter { asistencia -> asistencia.getEstadoAsistencia() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerAsistenciaPorId(id: String): Result<Asistencia> {
        return try {
            val response = asistenciaApi.obtenerAsistenciaPorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarAsistencia(
        id: String,
        tituloAsistencia: String? = null,
        fechaAsistencia: LocalDate? = null,
        usuarioId: String? = null,
        estadoAsistencia: Boolean? = null,
        estudiantesIds: List<String>? = null
    ): Result<Asistencia> {
        return try {
            val request = ActualizarAsistenciaRequest.from(
                titulo = tituloAsistencia,
                fecha = fechaAsistencia,
                usuarioId = usuarioId,
                estado = estadoAsistencia,
                estudiantes = estudiantesIds
            )

            val response = asistenciaApi.actualizarAsistencia(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarAsistencia(id: String): Result<Asistencia> {
        return try {
            val response = asistenciaApi.desactivarAsistencia(id)

            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Respuesta vacía del servidor"))
            } else {
                when (response.code()) {
                    404 -> Result.failure(Exception("Asistencia no encontrada"))
                    else -> Result.failure(Exception("Error del servidor: ${response.code()}"))
                }
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }


}
