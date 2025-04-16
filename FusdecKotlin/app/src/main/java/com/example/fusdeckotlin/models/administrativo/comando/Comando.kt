package com.example.fusdeckotlin.models.administrativo.comando

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import com.google.gson.annotations.SerializedName

data class Comando(
    @SerializedName("_id")
    private val id: String? = null,
    @SerializedName("nombreComando")
    private var nombreComando: String,
    @SerializedName("estadoComando")
    private var estadoComando: Boolean = true,
    @SerializedName("ubicacionComando")
    private var ubicacionComando: String,
    @SerializedName("fundacionid")
    private var fundacionId: String,
    @SerializedName("brigadas")
    private var brigadas: List<Any> = emptyList()
) {
    fun getId() = id
    fun getNombreComando() = nombreComando
    fun getEstadoComando() = estadoComando
    fun getUbicacionComando() = ubicacionComando
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

    fun setNombreComando(nombre: String) {
        nombreComando = nombre
    }

    fun setEstadoComando(estado: Boolean) {
        estadoComando = estado
    }

    fun setUbicacionComando(ubicacion: String) {
        ubicacionComando = ubicacion
    }

    fun setFundacionId(fundacion: String) {
        fundacionId = fundacion
    }

    fun setBrigadas(brigadas: List<String>) {
        this.brigadas = brigadas
    }


    fun getBrigadas(): List<Brigada>{
        return  brigadas.mapNotNull {
            when(it){
                is Brigada -> it
                is String -> Brigada(id = it, "", "", true, "", emptyList())
                is Map<*,*> -> convertMapToBrigadas(it)
                else -> null
            }
        }
    }
    fun getBrigadasIds(): List<String>{
        return  brigadas.map{
            when(it){
                is Brigada -> it.getId() ?: ""
                is String -> it
                is Map<*,*> -> it["_id"] as? String ?:""
                else -> ""
            }
        }
    }

    private fun convertMapToBrigadas(map: Map<*,*>): Brigada{
        return Brigada(
            id = map["_id"] as? String ?: "",
            nombreBrigada = map["nombreBrigada"] as? String ?: "",
            ubicacionBrigada = map["ubicacionBrigada"] as? String ?: "",
            estadoBrigada = map["estadoBrigada"] as? Boolean ?: true,
            comandoId = map["comandoId"] as? String ?: "",
            unidades = map["unidades"] as? List<String> ?: emptyList()
        )
    }

    private fun crearFundacionVacia(id: String): Fundacion {
        return Fundacion(
            id = id,
            nombreFundacion = "",
            estadoFundacion = true,
            comando = emptyList()
        )
    }
    private fun convertMapToFundacion(map: Map<*, *>): Fundacion {
        return Fundacion(
            id = map["_id"] as? String ?: "",
            nombreFundacion = map["nombreFundacion"] as? String ?: "",
            estadoFundacion = map["estadoFundacion"] as? Boolean ?: true,
            comando = map["comando"] as? List<String> ?: emptyList()
        )
    }
}
