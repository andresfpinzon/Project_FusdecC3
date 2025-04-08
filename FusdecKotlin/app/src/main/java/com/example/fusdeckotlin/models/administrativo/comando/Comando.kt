package com.example.fusdeckotlin.models.administrativo.comando

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
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
    fun getFundacionId() = fundacionId

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
    
    fun convertMapToBrigadas(map: Map<*,*>): Brigada{
        return Brigada(
            id = map["_id"] as? String ?: "",
            nombreBrigada = map["nombreBrigada"] as? String ?: "",
            ubicacionBrigada = map["ubicacionBrigada"] as? String ?: "",
            estadoBrigada = map["estadoBrigada"] as? Boolean ?: true,
            comandoId = map["comandoId"] as? String ?: "",
            unidades = map["unidades"] as? List<String> ?: emptyList()
        )
    }
}
