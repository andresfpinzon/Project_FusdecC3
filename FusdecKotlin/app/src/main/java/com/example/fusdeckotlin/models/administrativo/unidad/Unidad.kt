package com.example.fusdeckotlin.models.administrativo.unidad

import com.google.gson.annotations.SerializedName

class Unidad(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreUnidad") private var nombreUnidad: String,
    @SerializedName("brigadaId") private var brigadaId: Any, // String o Brigada
    @SerializedName("estadoUnidad") private var estadoUnidad: Boolean = true,
    @SerializedName("usuarioId") private var usuarioId: Any, // String o Usuario
    @SerializedName("comandos") private var comandos: List<Any> = emptyList(), // String o Comando
    @SerializedName("estudiantes") private var estudiantes: List<Any> = emptyList() // String o Estudiante
) {
    // Getters básicos
    fun getId() = id
    fun getNombreUnidad() = nombreUnidad
    fun getEstadoUnidad() = estadoUnidad

    // Manejo flexible de relaciones
    fun getBrigadaId(): String {
        return when(brigadaId) {
            is String -> brigadaId as String
            else -> "" // Implementar lógica si recibe objeto Brigada
        }
    }

    fun getUsuarioId(): String {
        return when(usuarioId) {
            is String -> usuarioId as String
            else -> ""
        }
    }

    fun getComandos(): List<String> {
        return comandos.map {
            when(it) {
                is String -> it
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    fun getEstudiantes(): List<String> {
        return estudiantes.map {
            when(it) {
                is String -> it
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    // Versiones que devuelven objetos completos
    fun getBrigada(): Any = brigadaId
    fun getUsuario(): Any = usuarioId
    fun getComandosObjects(): List<Any> = comandos
    fun getEstudiantesObjects(): List<Any> = estudiantes

    // Setters
    fun setNombreUnidad(nombre: String) {
        nombreUnidad = nombre
    }

    fun setBrigadaId(brigada: String) {
        brigadaId = brigada
    }

    fun setBrigada(brigada: Any) {
        brigadaId = brigada
    }

    fun setEstadoUnidad(estado: Boolean) {
        estadoUnidad = estado
    }

    fun setUsuarioId(usuario: String) {
        usuarioId = usuario
    }

    fun setUsuario(usuario: Any) {
        usuarioId = usuario
    }

    fun setComandos(comandos: List<String>) {
        this.comandos = comandos
    }

    fun setComandosObjects(comandos: List<Any>) {
        this.comandos = comandos
    }

    fun setEstudiantes(estudiantes: List<String>) {
        this.estudiantes = estudiantes
    }

    fun setEstudiantesObjects(estudiantes: List<Any>) {
        this.estudiantes = estudiantes
    }

    companion object {
        fun createDefault() = Unidad(
            id = "",
            nombreUnidad = "",
            brigadaId = "",
            estadoUnidad = true,
            usuarioId = "",
            comandos = emptyList(),
            estudiantes = emptyList()
        )
    }
}