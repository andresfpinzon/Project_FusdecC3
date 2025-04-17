package com.example.fusdeckotlin.models.secretario.estudiante

import com.google.gson.annotations.SerializedName

class Estudiante(
    @SerializedName("numeroDocumento") private val numeroDocumento: String,
    @SerializedName("nombre") private var nombre: String,
    @SerializedName("apellido") private var apellido: String,
    @SerializedName("tipoDocumento") private var tipoDocumento: String,
    @SerializedName("genero") private var genero: String,
    @SerializedName("unidad") private var unidad: String,
    @SerializedName("colegio") private var colegio: String,
    @SerializedName("edicion") private var edicion: String,
    @SerializedName("grado") private var grado: String,
    @SerializedName("estado") private var estado: Boolean = true,
    @SerializedName("asistenciasRegistradas") private var asistenciasRegistradas: Int,
    @SerializedName("aprobado") private var aprobado: Boolean

) {
    // Getters
    fun getNumeroDocumento(): String = numeroDocumento
    fun getNombre(): String = nombre
    fun getApellido(): String = apellido
    fun getTipoDocumento(): String = tipoDocumento
    fun getGenero(): String = genero
    fun getUnidad(): String = unidad
    fun getColegio(): String = colegio
    fun getEdicion(): String = edicion
    fun getGrado(): String = grado
    fun getEstado(): Boolean = estado
    fun getAsistenciasRegistradas(): Int = asistenciasRegistradas
    fun isAprobado(): Boolean = aprobado

    override fun toString(): String {
        return "Estudiante(numeroDocumento='$numeroDocumento', nombre='$nombre', apellido='$apellido', " +
                "tipoDocumento='$tipoDocumento', genero='$genero', unidad='$unidad', " +
                "colegio='$colegio', edicion='$edicion', grado='$grado', estado=$estado, " +
                "asistenciasRegistradas=$asistenciasRegistradas, aprobado=$aprobado)"
    }
}