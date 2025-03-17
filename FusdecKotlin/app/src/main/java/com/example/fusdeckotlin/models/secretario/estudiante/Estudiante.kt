package com.example.fusdeckotlin.models.secretario.estudiante

import java.time.LocalDate

class Estudiante(
    private val id: String,
    private var nombreEstudiante: String,
    private var apellidoEstudiante: String,
    private val correoEstudiante: String,
    private var tipoDocumento: String,
    private val numeroDocumento: String,
    private var fechaNacimiento: LocalDate,
    private var generoEstudiante: String,
    private var unidadId: String,
    private var colegioId: String,
    private var estadoEstudiante: Boolean,
    private var ediciones: List<String>,
    private var calificaciones: List<String>,
    private var asistencias: List<String>,
    private var certificados: List<String>
) {

    // Getters
    fun getId(): String = id
    fun getNombreEstudiante(): String = nombreEstudiante
    fun getApellidoEstudiante(): String = apellidoEstudiante
    fun getCorreoEstudiante(): String = correoEstudiante
    fun getTipoDocumento(): String = tipoDocumento
    fun getNumeroDocumento(): String = numeroDocumento
    fun getFechaNacimiento(): LocalDate = fechaNacimiento
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

    fun setFechaNacimiento(fechaNacimiento: LocalDate) {
        this.fechaNacimiento = fechaNacimiento
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

    companion object {
        val estudiante1 = Estudiante(
            id = "EST01",
            nombreEstudiante = "Juan",
            apellidoEstudiante = "Perez",
            correoEstudiante = "juan.perez@gmail.com",
            tipoDocumento = "C.C",
            numeroDocumento = "123456789",
            fechaNacimiento = LocalDate.of(2000,4,3),
            generoEstudiante = "Masculino",
            unidadId = "UN1018238",
            colegioId = "C0L12381918",
            estadoEstudiante = true,
            ediciones = listOf("2025-1"),
            calificaciones = listOf("CAL18270123"),
            asistencias = listOf("ASIS12391723-91"),
            certificados = listOf("CERT1293123801")
        )

        val estudiante2 = Estudiante(
            id = "EST02",
            nombreEstudiante = "Julian",
            apellidoEstudiante = "Rivera",
            correoEstudiante = "julian.rivera@gmail.com",
            tipoDocumento = "C.C",
            numeroDocumento = "123972123",
            fechaNacimiento = LocalDate.of(2005, 3, 30),
            generoEstudiante = "Masculino",
            unidadId = "UN1018238",
            colegioId = "C0L12381918",
            estadoEstudiante = true,
            ediciones = listOf("2025-1"),
            calificaciones = listOf("CAL18270321"),
            asistencias = listOf("ASIS12391723-19"),
            certificados = listOf("CERT1293123963")
        )

        val estudiante3 = Estudiante(
            id = "EST03",
            nombreEstudiante = "Andres",
            apellidoEstudiante = "Pinzon",
            correoEstudiante = "andres.pinzon@gmail.com",
            tipoDocumento = "C.C",
            numeroDocumento = "123972123",
            fechaNacimiento = LocalDate.of(1996, 4, 24),
            generoEstudiante = "Masculino",
            unidadId = "UN1018238",
            colegioId = "C0L12381918",
            estadoEstudiante = true,
            ediciones = listOf("2025-1"),
            calificaciones = listOf("CAL18270723"),
            asistencias = listOf("ASIS12391723-46"),
            certificados = listOf("CERT1293123753")
        )
    }
}
