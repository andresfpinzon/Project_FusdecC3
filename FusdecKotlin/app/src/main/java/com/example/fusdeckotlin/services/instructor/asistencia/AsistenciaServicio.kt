package com.example.fusdeckotlin.services.instructor.asistencia

import com.example.fusdeckotlin.api.instructor.asistencia.AsistenciaApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.models.instructor.asistencia.Asistencia
import java.time.LocalDate
import retrofit2.Response

object AsistenciaService {
    private val api: AsistenciaApi by lazy { RetrofitClient.asistenciaApi }

    suspend fun crearAsistencia(
        tituloAsistencia: String,
        fechaAsistencia: LocalDate,
        usuarioId: String,
        estudiantes: List<String>
    ): Response<Asistencia> {
        val asistencia = Asistencia(
            tituloAsistencia = tituloAsistencia,
            fechaAsistencia = fechaAsistencia.toString(),
            usuarioId = usuarioId,
            estudiantes = estudiantes
        )
        return api.crearAsistencia(asistencia)
    }

    suspend fun listarAsistenciasActivas(): Response<List<Asistencia>> {
        // El filtrado de activas podría hacerse en el backend o aquí
        return api.listarAsistencias()
    }

    suspend fun obtenerAsistenciaPorId(id: String): Response<Asistencia> {
        return api.obtenerAsistenciaPorId(id)
    }

    suspend fun actualizarAsistencia(
        id: String,
        tituloAsistencia: String,
        fechaAsistencia: LocalDate,
        usuarioId: String,
        estudiantes: List<String>
    ): Response<Asistencia> {
        val asistencia = Asistencia(
            id = id,
            tituloAsistencia = tituloAsistencia,
            fechaAsistencia = fechaAsistencia.toString(),
            usuarioId = usuarioId,
            estudiantes = estudiantes
        )
        return api.actualizarAsistencia(id, asistencia)
    }

    suspend fun desactivarAsistencia(id: String): Response<Asistencia> {
        return api.desactivarAsistencia(id)
    }
}