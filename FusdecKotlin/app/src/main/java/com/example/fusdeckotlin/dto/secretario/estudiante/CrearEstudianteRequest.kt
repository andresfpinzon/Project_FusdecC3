package com.example.fusdeckotlin.dto.secretario.estudiante

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class CrearEstudianteRequest(
    @SerializedName("nombreEstudiante")
    val nombreEstudiante: String,

    @SerializedName("apellidoEstudiante")
    val apellidoEstudiante: String,

    @SerializedName("correoEstudiante")
    val correoEstudiante: String,

    @SerializedName("tipoDocumento")
    val tipoDocumento: String,

    @SerializedName("numeroDocumento")
    val numeroDocumento: String,

    @SerializedName("fechaNacimiento")
    val fechaNacimiento: String,  // Formato: "YYYY-MM-DD"

    @SerializedName("generoEstudiante")
    val generoEstudiante: String,

    @SerializedName("unidadId")
    val unidadId: String,

    @SerializedName("colegioId")
    val colegioId: String,

    @SerializedName("estadoEstudiante")
    val estadoEstudiante: Boolean = true,

    @SerializedName("ediciones")
    val ediciones: List<String> = emptyList(),

    @SerializedName("calificaciones")
    val calificaciones: List<String> = emptyList(),

    @SerializedName("asistencias")
    val asistencias: List<String> = emptyList(),

    @SerializedName("certificados")
    val certificados: List<String> = emptyList()
) {
    companion object {
        fun from(
            nombreEstudiante: String,
            apellidoEstudiante: String,
            correoEstudiante: String,
            tipoDocumento: String,
            numeroDocumento: String,
            fechaNacimiento: LocalDate,
            generoEstudiante: String,
            unidadId: String,
            colegioId: String,
            estadoEstudiante: Boolean = true,
            ediciones: List<String> = emptyList(),
            calificaciones: List<String> = emptyList(),
            asistencias: List<String> = emptyList(),
            certificados: List<String> = emptyList()
        ): CrearEstudianteRequest {
            return CrearEstudianteRequest(
                nombreEstudiante = nombreEstudiante,
                apellidoEstudiante = apellidoEstudiante,
                correoEstudiante = correoEstudiante,
                tipoDocumento = tipoDocumento,
                numeroDocumento = numeroDocumento,
                fechaNacimiento = fechaNacimiento.toString(),
                generoEstudiante = generoEstudiante,
                unidadId = unidadId,
                colegioId = colegioId,
                estadoEstudiante = estadoEstudiante,
                ediciones = ediciones,
                calificaciones = calificaciones,
                asistencias = asistencias,
                certificados = certificados
            )
        }
    }
}