
package com.example.fusdeckotlin.models.administrativo.unidad
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.google.gson.annotations.SerializedName

data class Unidad(
    @SerializedName("_id")
    private val id: String? = null,
    @SerializedName("nombreUnidad")
    private var nombreUnidad: String,
    @SerializedName("brigadaId")
    private var brigadaId: String,
    @SerializedName("estadoUnidad")
    private var estadoUnidad: Boolean,
    @SerializedName("usuarioId")
    private var usuarioId: String,
    @SerializedName("comandos")
    private var comandos: List<String>,
    @SerializedName("estudiantes")
    private var estudiantes: List<String>
) {
    fun getId() = id
    fun getNombreUnidad() = nombreUnidad
    fun getBrigadaId() = brigadaId
    fun getEstadoUnidad() = estadoUnidad
    fun getUsuarioId() = usuarioId
    fun getEstudiantes() = estudiantes

    fun setNombreUnidad(nombre: String) {
        nombreUnidad = nombre
    }

    fun setBrigadaId(brigada: String) {
        brigadaId = brigada
    }

    fun setEstadoUnidad(estado: Boolean) {
        estadoUnidad = estado
    }

    fun setUsuarioId(usuario: String) {
        usuarioId = usuario
    }

    fun setComandos(comandos: List<String>) {
        this.comandos = comandos
    }

    fun setEstudiantes(estudiantes: List<String>) {
        this.estudiantes = estudiantes
    }

    fun getComandos(): List<Comando>{
        return comandos.mapNotNull {
            when (it) {
                is Comando -> it
                is String -> Comando (id = it, "", true, "", "", emptyList() )
                is Map<*, *> -> converMaptoComandos(it)
                else -> null
            }
        }
    }

    fun getComandoByIds(): List<String>{
        return comandos.map{
            when(it){
                is Comando -> it.getId() ?: ""
                is String -> it
                is Map<*,*> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }.filter { it.isNotEmpty() }
    }

    private fun converMaptoComandos(map: Map<*,*>): Comando {
        return Comando (
            id = map["_id"] as? String ?: "",
            nombreComando = map["nombreComando"] as? String ?: "",
            estadoComando = map["estadoComando"] as? Boolean ?: true,
            ubicacionComando = map["ubicacionComando"] as? String ?: "",
            fundacionId = map["fundacionId"] as? String ?: "",
            brigadas = map["brigadas"] as? List<String> ?: emptyList()
        )
    }



}