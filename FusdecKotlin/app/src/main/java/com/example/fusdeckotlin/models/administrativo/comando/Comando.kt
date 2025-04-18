package com.example.fusdeckotlin.models.administrativo.comando

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import com.google.gson.annotations.SerializedName

data class Comando(
    @SerializedName("_id") private val id: String,
    @SerializedName("nombreComando") private var nombreComando: String,
    @SerializedName("estadoComando") private var estadoComando: Boolean = true,
    @SerializedName("ubicacionComando") private var ubicacionComando: String,
    @SerializedName("fundacionId") private var fundacionId: Any,
    @SerializedName("brigadas") private var brigadas: List<Any> = emptyList()
) {
    // Getters básicos
    fun getId(): String = id
    fun getNombreComando(): String = nombreComando
    fun getEstadoComando(): Boolean = estadoComando
    fun getUbicacionComando(): String = ubicacionComando

    // Manejo de fundación - similar al manejo de curso en Edicion
    fun getFundacionId(): String {
        return when(fundacionId) {
            is String -> fundacionId as String
            is Fundacion -> (fundacionId as Fundacion).getId()
            is Map<*, *> -> (fundacionId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

    fun getFundacion(): Fundacion {
        return when(fundacionId) {
            is Fundacion -> fundacionId as Fundacion
            is String -> crearFundacionVacia(fundacionId as String)
            is Map<*, *> -> convertMapToFundacion(fundacionId as Map<*, *>)
            else -> crearFundacionVacia("")
        }
    }

    private fun crearFundacionVacia(id: String): Fundacion {
        return Fundacion(
            id = id,
            nombreFundacion = "",
            estadoFundacion = true,
        )
    }

    private fun convertMapToFundacion(map: Map<*, *>): Fundacion {
        return Fundacion(
            id = map["_id"] as? String ?: "",
            nombreFundacion = map["nombreFundacion"] as? String ?: "",
            estadoFundacion = map["estadoFundacion"] as? Boolean ?: true,
        )
    }

    // Manejo de brigadas
    fun getBrigadas(): List<Brigada> {
        return brigadas.mapNotNull {
            when(it) {
                is Brigada -> it
                is String -> crearBrigadaVacia(it)
                is Map<*, *> -> convertMapToBrigada(it as Map<String, Any>)
                else -> null
            }
        }
    }

    fun getBrigadasIds(): List<String> {
        return brigadas.map {
            when(it) {
                is Brigada -> it.getId()
                is String -> it
                is Map<*, *> -> (it as Map<String, Any>)["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    private fun crearBrigadaVacia(id: String): Brigada {
        return Brigada(
            id = id,
            nombreBrigada = "",
            ubicacionBrigada = "",
            estadoBrigada = true,
            comandoId = this.id,
        )
    }

    private fun convertMapToBrigada(map: Map<String, Any>): Brigada {
        return Brigada(
            id = map["_id"] as? String ?: "",
            nombreBrigada = map["nombreBrigada"] as? String ?: "",
            ubicacionBrigada = map["ubicacionBrigada"] as? String ?: "",
            estadoBrigada = map["estadoBrigada"] as? Boolean ?: true,
            comandoId = map["comandoId"] as? String ?: this.id,
        )
    }

    override fun toString(): String {
        return "Comando(id='$id', nombre='$nombreComando', ubicación='$ubicacionComando', " +
                "fundacionId='${getFundacionId()}', brigadas=${getBrigadasIds().joinToString()})"
    }
}
