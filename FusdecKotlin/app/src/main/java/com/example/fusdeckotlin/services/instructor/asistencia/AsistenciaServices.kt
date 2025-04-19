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
        usuarioId: String
    ): Result<Asistencia> {
        return try {
            val request = CrearAsistenciaRequest(
                titulo = titulo,
                fecha = fecha.toString(),
                usuarioId = usuarioId
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
            handleListResponse(response) { it.filter { asistencia -> asistencia.getEstado() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerAsistenciaPorId(id: Int): Result<Asistencia> {
        return try {
            val response = asistenciaApi.obtenerAsistenciaPorId(id.toString())
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarAsistencia(
        id: Int,
        titulo: String? = null,
        fecha: LocalDate? = null,
        estado: Boolean? = null
    ): Result<Asistencia> {
        return try {
            val request = ActualizarAsistenciaRequest(
                titulo = titulo,
                fecha = fecha?.toString(),
                estado = estado
            )

            val response = asistenciaApi.actualizarAsistencia(id.toString(), request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarAsistencia(id: Int): Result<Asistencia> {
        return try {
            val response = asistenciaApi.desactivarAsistencia(id.toString())
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
