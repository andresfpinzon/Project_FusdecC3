package com.example.fusdeckotlin.models.administrativo.unidad

import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.google.gson.annotations.SerializedName
import com.example.fusdeckotlin.models.administrativo.user.model.Usuario

data class Unidad(
    @SerializedName("_id")
    private val id: String,
    @SerializedName("nombreUnidad")
    private var nombreUnidad: String,
    @SerializedName("brigadaId")
    private var brigadaId: Any,
    @SerializedName("estadoUnidad")
    private var estadoUnidad: Boolean = true,
    @SerializedName("usuarioId")
    private var usuarioId: Any,
) {
    fun getId() = id
    fun getNombreUnidad() = nombreUnidad

    fun getBrigadaId(): String{
        return when (brigadaId) {
            is String -> brigadaId as String
            is Brigada -> (brigadaId as Brigada).getId()
            is Map<*, *> -> (brigadaId as Map<*, *>)["_id"] as? String ?: ""
            else -> ""
        }
    }

    fun getBrigada(): Brigada {
        return when (brigadaId){
            is Brigada -> brigadaId as Brigada
            is String -> createBrigradaEmpty(brigadaId as String)
            is Map<*,*> -> convertMaptoBrigada(brigadaId as Map<*,*>)
            else -> createBrigradaEmpty("")
        }
    }

    private fun createBrigradaEmpty(id: String): Brigada{
         return Brigada(
             id = id,
             nombreBrigada = "",
             ubicacionBrigada = "",
             comandoId = "",
             unidades = emptyList(),
         )
    }

    private fun convertMaptoBrigada(map: Map<*,*>): Brigada {
        return Brigada(
            id = map["_id"] as? String ?: "",
            nombreBrigada = map["nombreBrigada"] as? String ?: "",
            ubicacionBrigada = map["ubicacionBrigada"] as? String ?: "",
            comandoId = map["comandoId"] as? String ?: "",
            unidades = map["unidades"] as? List<String> ?: emptyList()
        )
    }
    fun getEstadoUnidad() = estadoUnidad

    fun getUsuarioId(): String {
        return when (usuarioId) {
            is String -> usuarioId as String
            is Usuario -> (usuarioId as Usuario).getUserId()
            is Map<*,*> -> (usuarioId as Map<*,*>) ["_id"] as? String ?:""
            else -> ""
        }
    }
    fun getUser(): Usuario {
        return when (usuarioId){
            is Usuario -> usuarioId as Usuario
            is String -> createUsersEmpty(usuarioId as String)
            is Map<*,*> -> convertMapToUsers(usuarioId as Map<*,*>)
            else -> createUsersEmpty("")
        }
    }

    private fun createUsersEmpty(id: String): Usuario {
        return Usuario(
            id = id,
            nombreUsuario = "",
            apellidoUsuario = "",
            numeroDocumento = "",
            correo = "",
            password = "",
            roles = emptyList(),
        )
    }

    private fun convertMapToUsers(map: Map<*,*>): Usuario {
        return Usuario(
            id = map["_id"] as? String ?: "",
            nombreUsuario = map["nombreUsuario"] as? String ?: "",
            apellidoUsuario = map["apellidoUsuario"] as? String ?: "",
            numeroDocumento = map["numeroDocumento"] as? String ?: "",
            correo = map["correo"] as? String ?: "",
            password = map["password"] as? String ?: "",
            roles = map["roles"] as? List<String> ?: emptyList()
        )
    }

}