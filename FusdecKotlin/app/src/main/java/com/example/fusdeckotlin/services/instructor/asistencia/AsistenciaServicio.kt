package com.example.fusdeckotlin.services.instructor.asistencia

import com.example.fusdeckotlin.api.instructor.asistencia.AsistenciaApi
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import okhttp3.ResponseBody.Companion.toResponseBody
import retrofit2.Response

class AsistenciaServicio(private val api: AsistenciaApi) {

    suspend fun listarAsistencias(): Response<List<Asistencia>> {
        return try {
            val response = api.listarAsistencias()
            if (!response.isSuccessful) {
                // Log de error si la respuesta de la API no es exitosa
                println("Error al obtener asistencias: ${response.code()} - ${response.errorBody()?.string()}")
            }
            response
        } catch (e: Exception) {
            e.printStackTrace()
            println("Excepción en listarAsistencias: ${e.message}")
            Response.success(emptyList()) // Devuelve una lista vacía en caso de error
        }
    }


    suspend fun obtenerAsistenciaPorId(id: String): Response<Asistencia> {
        return try {
            api.obtenerAsistenciaPorId(id)
        } catch (e: Exception) {
            Response.error(500, e.message?.toResponseBody())
        }
    }

    suspend fun crearAsistencia(
        titulo: String,
        fecha: String,
        usuarioId: String,
        estudiantesIds: List<String> // Solo IDs
    ): Response<Asistencia> {
        return try {
            val asistencia = Asistencia(
                tituloAsistencia = titulo,
                fechaAsistencia = fecha,
                usuarioId = usuarioId,
                estudiantesIds = estudiantesIds
            )
            api.crearAsistencia(asistencia)
        } catch (e: Exception) {
            Response.error(500, e.message?.toResponseBody())
        }
    }

    suspend fun actualizarAsistencia(
        id: String,
        titulo: String? = null,
        fecha: String? = null,
        usuarioId: String? = null,
        estado: Boolean? = null,
        estudiantesIds: List<String>? = null // Solo IDs
    ): Response<Asistencia> {
        return try {
            // Obtener la asistencia existente primero
            val response = api.obtenerAsistenciaPorId(id)
            if (!response.isSuccessful) {
                return response
            }

            val asistenciaExistente = response.body()!!

            // Crear la asistencia actualizada
            val asistenciaActualizada = Asistencia(
                id = id,
                tituloAsistencia = titulo ?: asistenciaExistente.tituloAsistencia,
                fechaAsistencia = fecha ?: asistenciaExistente.fechaAsistencia,
                usuarioId = usuarioId ?: asistenciaExistente.usuarioId,
                estadoAsistencia = estado ?: asistenciaExistente.estadoAsistencia,
                estudiantesIds = estudiantesIds ?: asistenciaExistente.estudiantesIds
            )

            api.actualizarAsistencia(id, asistenciaActualizada)
        } catch (e: Exception) {
            Response.error(500, e.message?.toResponseBody())
        }
    }

    suspend fun desactivarAsistencia(id: String): Response<Asistencia> {
        return try {
            api.desactivarAsistencia(id)
        } catch (e: Exception) {
            Response.error(500, e.message?.toResponseBody())
        }
    }
}
