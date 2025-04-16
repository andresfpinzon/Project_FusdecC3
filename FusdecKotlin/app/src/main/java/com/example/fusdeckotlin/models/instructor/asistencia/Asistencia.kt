package com.example.fusdeckotlin.models.instructor.asistencia

import com.google.gson.annotations.SerializedName
import java.time.LocalDate

data class Asistencia(
    @SerializedName("id") private val id: Int,
    @SerializedName("titulo") private val titulo: String,
    @SerializedName("fecha") private val fechaString: String,
    @SerializedName("usuarioId") private val usuarioId: String,
    @SerializedName("estado") private val estado: Boolean = true,
    @SerializedName("createdAt") private val createdAt: String
) {
    // Funciones get() para acceder a las propiedades
    fun getId(): Int = id
    fun getTitulo(): String = titulo
    fun getFecha(): LocalDate = LocalDate.parse(fechaString.substring(0, 10))
    fun getUsuarioId(): String = usuarioId
    fun getEstado(): Boolean = estado
    fun getCreatedAt(): String = createdAt

    override fun toString(): String {
        return "Asistencia(id=${getId()}, titulo='${getTitulo()}', fecha=${getFecha()}, " +
                "usuarioId='${getUsuarioId()}', estado=${getEstado()}, createdAt='${getCreatedAt()}')"
    }
}