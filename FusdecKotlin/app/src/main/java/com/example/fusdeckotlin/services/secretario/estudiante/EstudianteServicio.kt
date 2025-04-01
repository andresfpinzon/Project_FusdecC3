package com.example.fusdeckotlin.services.secretario.estudiante

import com.example.fusdeckotlin.api.secretario.estudiante.EstudianteApi
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import okhttp3.ResponseBody
import retrofit2.Response

class EstudianteServicio(private val api: EstudianteApi) {

    suspend fun crearEstudiante(estudiante: Estudiante): Response<Estudiante> {
        return api.crearEstudiante(estudiante)
    }

    suspend fun listarEstudiantes(): Response<List<Estudiante>> {
        return api.listarEstudiantes()
    }

    suspend fun obtenerEstudiantePorId(id: String): Response<Estudiante> {
        return api.obtenerEstudiantePorId(id)
    }

    suspend fun actualizarEstudiante(id: String, estudiante: Estudiante): Response<Estudiante> {
        return api.actualizarEstudiante(id, estudiante)
    }

    suspend fun desactivarEstudiante(id: String): Response<Estudiante> {
        return api.desactivarEstudiante(id)
    }
}


