package com.example.fusdeckotlin.services.instructor.asistencia

import com.example.fusdeckotlin.api.instructor.asistencia.AsistenciaApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.instructor.asistencia.CrearAsistenciaRequest
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import java.time.LocalDate
import retrofit2.Response

class AsistenciaServicio {

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
        estudiantes: List<String>? = null
    ): Result<Asistencia> {
        return try {

            val currentResponse = asistenciaApi.obtenerAsistenciaPorId(id)
            if (!currentResponse.isSuccessful || currentResponse.body() == null) {
                return Result.failure(Exception("Asistencia no encontrada"))
            }

            val asistenciaActual = currentResponse.body()!!


            tituloAsistencia?.let { asistenciaActual.setTituloAsistencia(it) }
            fechaAsistencia?.let { asistenciaActual.setFechaAsistencia(it) }
            usuarioId?.let { asistenciaActual.setUsuarioId(it) }
            estadoAsistencia?.let { asistenciaActual.setEstadoAsistencia(it) }
            estudiantes?.let { asistenciaActual.setEstudiantes(it) }

            val response = asistenciaApi.actualizarAsistencia(id, asistenciaActual)
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

    private fun <T> handleResponse(response: Response<T>): Result<T> {
        return if (response.isSuccessful) {
            response.body()?.let {
                Result.success(it)
            } ?: Result.failure(Exception("Respuesta vacía del servidor"))
        } else {
            Result.failure(Exception("Error del servidor: ${response.code()} - ${response.message()}"))
        }
    }

    private fun <T> handleListResponse(
        response: Response<List<T>>,
        transform: (List<T>) -> List<T> = { it }
    ): Result<List<T>> {
        return if (response.isSuccessful) {
            response.body()?.let {
                Result.success(transform(it))
            } ?: Result.failure(Exception("Respuesta vacía del servidor"))
        } else {
            Result.failure(Exception("Error del servidor: ${response.code()} - ${response.message()}"))
        }
    }
}
