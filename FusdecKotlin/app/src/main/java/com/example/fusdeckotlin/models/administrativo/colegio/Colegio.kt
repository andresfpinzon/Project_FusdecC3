package com.example.fusdeckotlin.models.administrativo.colegio

data class Colegio(
    private val id: String,
    private var nombreColegio: String,
    private var emailColegio: String,
    private var estadoColegio: Boolean,
    private var estudiantes: List<String>,
    private var direccionColegio: String
) {
    fun getId() = id
    fun getNombreColegio() = nombreColegio
    fun getEmailColegio() = emailColegio
    fun getEstadoColegio() = estadoColegio
    fun getEstudiantes() = estudiantes
    fun getDireccionColegio() = direccionColegio

    fun setNombreColegio(nombre: String) {
        nombreColegio = nombre
    }

    fun setEmailColegio(email: String) {
        emailColegio = email
    }

    fun setEstadoColegio(estado: Boolean) {
        estadoColegio = estado
    }

    fun setEstudiantes(estudiantes: List<String>) {
        this.estudiantes = estudiantes
    }

    fun setDireccionColegio(direccion: String) {
        direccionColegio = direccion
    }

    companion object {
        val colegio1 = Colegio(
            id = "COL01",
            nombreColegio = "Colegio 1",
            emailColegio = "mmc@gmail.com",
            estadoColegio = true,
            estudiantes = listOf("EST01", "EST02"),
            direccionColegio = "Direccion 1"
        )

        val colegio2 = Colegio(
            id = "COL02",
            nombreColegio = "Colegio 2",
            emailColegio = "colegio2@gmail.com",
            estadoColegio = true,
            estudiantes = listOf("EST03", "EST04"),
            direccionColegio = "Direccion 2"
        )
    }
}