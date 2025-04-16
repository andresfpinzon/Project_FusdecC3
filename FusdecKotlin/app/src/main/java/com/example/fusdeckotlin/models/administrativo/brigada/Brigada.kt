package com.example.fusdeckotlin.models.administrativo.brigada

import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import com.google.gson.annotations.SerializedName

data class Brigada(
    @SerializedName("_id")
    private val id: String? = null,
    @SerializedName("nombreBrigada")
    private var nombreBrigada: String,
    @SerializedName("ubicacionBrigada")
    private var ubicacionBrigada: String,
    @SerializedName("estadoBrigada")
    private var estadoBrigada: Boolean = true,
    @SerializedName("comandoId")
    private var comandoId: Any,
    @SerializedName("unidades")
    private var unidades: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId() = id.toString()
    fun getNombreBrigada() = nombreBrigada
    fun getUbicacionBrigada() = ubicacionBrigada
    fun getEstadoBrigada() = estadoBrigada

    fun getComandoId(): String {
        return when(comandoId) {
            is String -> comandoId as String
            is Comando -> (comandoId as Comando).getId() ?: ""
            is Map<*, *> -> (comandoId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

    // Obtener objeto Comando completo
    fun getComando(): Comando {
        return when(comandoId) {
            is Comando -> comandoId as Comando
            is String -> crearComandoVacio(comandoId as String)
            is Map<*, *> -> convertMapToComando(comandoId as Map<*, *>)
            else -> crearComandoVacio("")
        }
    }

    private fun crearComandoVacio(id: String): Comando {
        return Comando(
            id = id,
            nombreComando = "",
            estadoComando = true,
            ubicacionComando = "",
            fundacionId = "",
            brigadas = emptyList()
        )
    }

    private fun convertMapToComando(map: Map<*, *>): Comando {
        return Comando(
            id = map["_id"] as? String ?: "",
            nombreComando = map["nombreComando"] as? String ?: "",
            estadoComando = map["estadoComando"] as? Boolean ?: true,
            ubicacionComando = map["ubicacionComando"] as? String ?: "",
            fundacionId = map["fundacionId"] as? String ?: "",
            brigadas = map["brigadas"] as? List<Any> ?: emptyList()
        )
    }

    // Getters para manejar referencias


    // Setters
    fun setNombreBrigada(nombre: String) {
        nombreBrigada = nombre
    }

    fun setUbicacionBrigada(ubicacion: String) {
        ubicacionBrigada = ubicacion
    }

    fun setEstadoBrigada(estado: Boolean) {
        estadoBrigada = estado
    }

    fun setComandoId(comando: String) {
        comandoId = comando
    }



    fun setUnidades(unidades: List<Unidad>) {
        this.unidades = unidades
    }

    fun setUnidadesIds(unidadesIds: List<String>) {
        this.unidades = unidadesIds
    }

    fun getUnidades(): List<Unidad> {
        return unidades.mapNotNull {
            when (it) {
                is Unidad -> it
                is String -> Unidad(id = it, "", "", true, "", emptyList(), emptyList())
                is Map<*, *> -> convertMaptoUnidades(it)
                else -> null
            }
        }
    }
    fun getUnidadesIds(): List<String>{
        return  unidades.map{
            when(it) {
                is Unidad -> it.getId() ?: ""
                is String -> it
                is Map<*, *> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    private fun convertMaptoUnidades(map: Map<*, *>): Unidad {
        return Unidad (
            id = map["_id"] as? String ?: "",
            nombreUnidad = map["nombreUnidad"] as? String ?: "",
            brigadaId = map["brigadaId"] as? String ?: "",
            estadoUnidad = map["estadoUnidad"] as? Boolean ?: true,
            usuarioId = map["usuarioId"] as? String ?: "",
            comandos = map["comandos"] as? List<String> ?: emptyList(),
            estudiantes = map["estudiantes"] as? List<String> ?: emptyList()
        )
    }

}