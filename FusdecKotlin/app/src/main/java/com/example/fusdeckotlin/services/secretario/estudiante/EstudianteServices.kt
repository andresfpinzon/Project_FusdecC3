package com.example.fusdeckotlin.services.secretario.estudiante

import com.example.fusdeckotlin.api.secretario.estudiante.EstudianteApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.secretario.estudiante.ActualizarEstudianteRequest
import com.example.fusdeckotlin.dto.secretario.estudiante.CrearEstudianteRequest
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import java.time.LocalDate

class EstudianteServices {

    private val estudianteApi: EstudianteApi = RetrofitClient.estudianteApi

    suspend fun crearEstudiante(
        nombreEstudiante: String,
        apellidoEstudiante: String,
        tipoDocumento: String,
        numeroDocumento: String,
        fechaNacimiento: LocalDate,
        generoEstudiante: String,
        unidadId: String,
        colegioId: String
    ): Result<Estudiante> {
        return try {
            val request = CrearEstudianteRequest.from(
                nombreEstudiante = nombreEstudiante,
                apellidoEstudiante = apellidoEstudiante,
                tipoDocumento = tipoDocumento,
                numeroDocumento = numeroDocumento,
                fechaNacimiento = fechaNacimiento,
                generoEstudiante = generoEstudiante,
                unidadId = unidadId,
                colegioId = colegioId
            )

            val response = estudianteApi.crearEstudiante(request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun listarEstudiantesActivos(): Result<List<Estudiante>> {
        return try {
            val response = estudianteApi.listarEstudiantes()
            handleListResponse(response) { it.filter { estudiante -> estudiante.getEstadoEstudiante() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerEstudiantePorId(id: String): Result<Estudiante> {
        return try {
            val response = estudianteApi.obtenerEstudiantePorId(id)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarEstudiante(
        id: String,
        nombreEstudiante: String? = null,
        apellidoEstudiante: String? = null,
        tipoDocumento: String? = null,
        numeroDocumento: String? = null,
        fechaNacimiento: LocalDate? = null,
        generoEstudiante: String? = null,
        unidadId: String? = null,
        colegioId: String? = null,
        estadoEstudiante: Boolean? = null,
        edicionesIds: List<String>? = null,
        calificacionesIds: List<String>? = null,
        asistenciasIds: List<String>? = null,
        certificadosIds: List<String>? = null
    ): Result<Estudiante> {
        return try {
            val request = ActualizarEstudianteRequest.from(
                nombreEstudiante = nombreEstudiante,
                apellidoEstudiante = apellidoEstudiante,
                tipoDocumento = tipoDocumento,
                numeroDocumento = numeroDocumento,
                fechaNacimiento = fechaNacimiento,
                generoEstudiante = generoEstudiante,
                unidadId = unidadId,
                colegioId = colegioId,
                estadoEstudiante = estadoEstudiante,
                ediciones = edicionesIds,
                calificaciones = calificacionesIds,
                asistencias = asistenciasIds,
                certificados = certificadosIds
            )

            val response = estudianteApi.actualizarEstudiante(id, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarEstudiante(id: String): Result<Estudiante> {
        return try {
            val response = estudianteApi.desactivarEstudiante(id)

            if (response.isSuccessful) {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Respuesta vacía del servidor"))
            } else {
                when (response.code()) {
                    404 -> Result.failure(Exception("Estudiante no encontrado"))
                    else -> Result.failure(Exception("Error del servidor: ${response.code()}"))
                }
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}


