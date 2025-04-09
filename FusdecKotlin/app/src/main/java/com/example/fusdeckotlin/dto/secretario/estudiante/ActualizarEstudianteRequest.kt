package com.example.fusdeckotlin.dto.secretario.estudiante

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class ActualizarEstudianteRequest(
    @SerializedName("nombreEstudiante")
    val nombreEstudiante: String? = null,

    @SerializedName("apellidoEstudiante")
    val apellidoEstudiante: String? = null,

    @SerializedName("tipoDocumento")
    val tipoDocumento: String? = null,

    @SerializedName("fechaNacimiento")
    val fechaNacimiento: String? = null,  // Formato: "YYYY-MM-DD"

    @SerializedName("generoEstudiante")
    val generoEstudiante: String? = null,

    @SerializedName("unidadId")
    val unidadId: String? = null,

    @SerializedName("colegioId")
    val colegioId: String? = null,

    @SerializedName("estadoEstudiante")
    val estadoEstudiante: Boolean? = null,

    @SerializedName("ediciones")
    val ediciones: List<String>? = null,

    @SerializedName("calificaciones")
    val calificaciones: List<String>? = null,

    @SerializedName("asistencias")
    val asistencias: List<String>? = null,

    @SerializedName("certificados")
    val certificados: List<String>? = null
) {
    companion object {
        fun from(
            nombreEstudiante: String? = null,
            apellidoEstudiante: String? = null,
            tipoDocumento: String? = null,
            fechaNacimiento: LocalDate? = null,
            generoEstudiante: String? = null,
            unidadId: String? = null,
            colegioId: String? = null,
            estadoEstudiante: Boolean? = null,
            ediciones: List<String>? = null,
            calificaciones: List<String>? = null,
            asistencias: List<String>? = null,
            certificados: List<String>? = null
        ): ActualizarEstudianteRequest {
            return ActualizarEstudianteRequest(
                nombreEstudiante = nombreEstudiante,
                apellidoEstudiante = apellidoEstudiante,
                tipoDocumento = tipoDocumento,
                fechaNacimiento = fechaNacimiento?.toString(),
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