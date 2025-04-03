package com.example.fusdeckotlin.models.secretario.estudiante

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

class Estudiante(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreEstudiante") private var nombreEstudiante: String,
    @SerializedName("apellidoEstudiante") private var apellidoEstudiante: String,
    @SerializedName("correoEstudiante") private val correoEstudiante: String,
    @SerializedName("tipoDocumento") private var tipoDocumento: String,
    @SerializedName("numeroDocumento") private val numeroDocumento: String,
    @SerializedName("fechaNacimiento") private var fechaNacimientoString: String,
    @SerializedName("generoEstudiante") private var generoEstudiante: String,
    @SerializedName("unidadId") private var unidadId: String,
    @SerializedName("colegioId") private var colegioId: String,
    @SerializedName("estadoEstudiante") private var estadoEstudiante: Boolean,
    @SerializedName("ediciones") private var ediciones: List<String>,
    @SerializedName("calificaciones") private var calificaciones: List<String>,
    @SerializedName("asistencias") private var asistencias: List<String>,
    @SerializedName("certificados") private var certificados: List<String>,
) {
    // Getters
    fun getId(): String = id
    fun getNombreEstudiante(): String = nombreEstudiante
    fun getApellidoEstudiante(): String = apellidoEstudiante
    fun getCorreoEstudiante(): String = correoEstudiante
    fun getTipoDocumento(): String = tipoDocumento
    fun getNumeroDocumento(): String = numeroDocumento

    fun getFechaNacimiento(): LocalDate {
        return LocalDate.parse(fechaNacimientoString.substring(0, 10))
    }

    fun getGeneroEstudiante(): String = generoEstudiante
    fun getUnidadId(): String = unidadId
    fun getColegioId(): String = colegioId
    fun getEstadoEstudiante(): Boolean = estadoEstudiante
    fun getEdiciones(): List<String> = ediciones
    fun getCalificaciones(): List<String> = calificaciones
    fun getAsistencias(): List<String> = asistencias
    fun getCertificados(): List<String> = certificados

    // Setters
    fun setNombreEstudiante(nombre: String) {
        this.nombreEstudiante = nombre
    }

    fun setApellidoEstudiante(apellido: String) {
        this.apellidoEstudiante = apellido
    }

    fun setTipoDocumento(tipoDocumento: String) {
        this.tipoDocumento = tipoDocumento
    }

    fun setFechaNacimientoString(fechaNacimiento: String) {
        this.fechaNacimientoString = fechaNacimiento
    }

    fun setGeneroEstudiante(genero: String) {
        this.generoEstudiante = genero
    }

    fun setUnidadId(unidadId: String) {
        this.unidadId = unidadId
    }

    fun setColegioId(colegioId: String) {
        this.colegioId = colegioId
    }

    fun setEstadoEstudiante(estado: Boolean) {
        this.estadoEstudiante = estado
    }

    fun setEdiciones(ediciones: List<String>) {
        this.ediciones = ediciones
    }

    fun setCalificaciones(calificaciones: List<String>) {
        this.calificaciones = calificaciones
    }

    fun setAsistencias(asistencias: List<String>) {
        this.asistencias = asistencias
    }

    fun setCertificados(certificados: List<String>) {
        this.certificados = certificados
    }
}