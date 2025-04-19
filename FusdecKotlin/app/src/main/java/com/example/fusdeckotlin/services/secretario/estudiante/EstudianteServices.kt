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
        nombre: String,
        apellido: String,
        tipoDocumento: String,
        numeroDocumento: String,
        genero: String,
        unidad: String,
        colegio: String,
        edicion: String,
        grado: String
    ): Result<Estudiante> {
        return try {
            val request = CrearEstudianteRequest(
                numeroDocumento = numeroDocumento,
                nombre = nombre,
                apellido = apellido,
                tipoDocumento = tipoDocumento,
                genero = genero,
                unidad = unidad,
                colegio = colegio,
                edicion = edicion,
                grado = grado
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
            handleListResponse(response) { it.filter { estudiante -> estudiante.getEstado() } }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun obtenerEstudiantePorDocumento(documento: String): Result<Estudiante> {
        return try {
            val response = estudianteApi.obtenerEstudiantePorDocumento(documento)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun actualizarEstudiante(
        documento: String,
        nombre: String? = null,
        apellido: String? = null,
        tipoDocumento: String? = null,
        genero: String? = null,
        unidad: String? = null,
        colegio: String? = null,
        edicion: String? = null,
        grado: String? = null,
        estado: Boolean? = null

    ): Result<Estudiante> {
        return try {
            val request = ActualizarEstudianteRequest(
                nombre = nombre,
                apellido = apellido,
                tipoDocumento = tipoDocumento,
                genero = genero,
                unidad = unidad,
                colegio = colegio,
                edicion = edicion,
                grado = grado,
                estado = estado,
            )

            val response = estudianteApi.actualizarEstudiante(documento, request)
            handleResponse(response)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun desactivarEstudiante(documento: String): Result<Estudiante> {
        return try {
            val response = estudianteApi.desactivarEstudiante(documento)

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


