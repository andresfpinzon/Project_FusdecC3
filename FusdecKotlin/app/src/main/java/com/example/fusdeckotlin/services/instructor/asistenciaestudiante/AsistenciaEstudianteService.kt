package com.example.fusdeckotlin.services.instructor.asistenciaestudiante


import com.example.fusdeckotlin.api.instructor.asistenciaestudiante.AsistenciaEstudianteApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.instructor.asistenciaestudiante.AsistenciaEstudianteCreateRequest
import com.example.fusdeckotlin.models.instructor.asistenciaestudiante.AsistenciaEstudiante


import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class AsistenciaEstudianteService {

    private val api: AsistenciaEstudianteApi = RetrofitClient.asistenciaestudianteApi

    suspend fun obtenerTodasLasRelaciones(): Result<List<AsistenciaEstudiante>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = api.obtenerTodasLasRelaciones()
                handleListResponse(response)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    suspend fun crearAsistenciaEstudiante(
        asistenciaId: Int,
        estudianteId: String
    ): Result<AsistenciaEstudiante> {
        return withContext(Dispatchers.IO) {
            try {
                val request = AsistenciaEstudianteCreateRequest(
                    asistenciaId = asistenciaId,
                    estudianteId = estudianteId
                )
                val response = api.crearAsistenciaEstudiante(request)
                handleResponse(response)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    suspend fun eliminarAsistenciaEstudiante(
        asistenciaId: Int,
        estudianteId: String
    ): Result<Boolean> {
        return withContext(Dispatchers.IO) {
            try {
                val response = api.eliminarAsistenciaEstudiante(asistenciaId, estudianteId)
                Result.success(response.isSuccessful)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }
}