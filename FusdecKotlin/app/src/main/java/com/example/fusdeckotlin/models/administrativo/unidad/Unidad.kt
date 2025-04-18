
package com.example.fusdeckotlin.models.administrativo.unidad
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.google.gson.annotations.SerializedName
import models.administrativo.user.model.Usuario

data class Unidad(
    @SerializedName("_id")
    private val id: String? = null,
    @SerializedName("nombreUnidad")
    private var nombreUnidad: String,
    @SerializedName("brigadaId")
    private var brigadaId: Any,
    @SerializedName("estadoUnidad")
    private var estadoUnidad: Boolean = true,
    @SerializedName("usuarioId")
    private var usuarioId: Any,
    @SerializedName("comandos")
    private var comandos: List<Any>,
    @SerializedName("estudiantes")
    private var estudiantes: List<Any>
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

    fun getBrigadaObject(): Brigada {
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
    fun getUserObject(): Usuario{
        return when (usuarioId){
            is Usuario -> usuarioId as Usuario
            is String -> createUsersEmpty(usuarioId as String)
            is Map<*,*> -> convertMapToUsers(usuarioId as Map<*,*>)
            else -> createUsersEmpty("")
        }
    }

    private fun createUsersEmpty(id: String): Usuario{
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

    fun getComandos(): List<Comando> {
        return comandos?.mapNotNull {
            when (it) {
                is Comando -> it
                is String -> Comando(id = it, "", true, "", "", emptyList())
                is Map<*, *> -> convertMaptoComandos(it)
                else -> null
            }
        } ?: emptyList() // Devuelve lista vacía si comandos es null
    }

    fun getComandoByIds(): List<String> {
        return comandos?.map {
            when(it) {
                is Comando -> it.getId() ?: ""
                is String -> it
                is Map<*,*> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }?.filter { it.isNotEmpty() } ?: emptyList() // Seguro contra null
    }

    // Versión mejorada de convertMaptoComandos
    private fun convertMaptoComandos(map: Map<*,*>): Comando {
        return try {
            Comando(
                id = map["_id"] as? String ?: "",
                nombreComando = map["nombreComando"] as? String ?: "",
                estadoComando = map["estadoComando"] as? Boolean ?: true,
                ubicacionComando = map["ubicacionComando"] as? String ?: "",
                fundacionId = map["fundacionId"] as? String ?: "",
                brigadas = map["brigadas"] as? List<String> ?: emptyList()
            )
        } catch (e: Exception) {
            // Devuelve un comando vacío si hay error en la conversión
            Comando(id = "", nombreComando = "", estadoComando = true,
                ubicacionComando = "", fundacionId = "", brigadas = emptyList())
        }
    }

    fun getEstudiantes(): List<Estudiante>{
        return estudiantes.mapNotNull {
            when (it) {
                is Estudiante -> it
                is String -> Estudiante(id = it, "", "", "", "", "", "", "", "",  true, emptyList(), emptyList(),
                    emptyList(), emptyList())
                is Map<*,*> -> convertMapToEstudiantes(it)
                else -> null
            }
        }
    }
    fun getEstudiantesByIds(): List<String>{
        return estudiantes.map{
            when(it){
                is Estudiante -> it.getId() ?: ""
                is String -> it
                is Map<*,*> -> it["_id"] as? String ?: ""
                else -> ""
            }
        }
    }


    private fun convertMapToEstudiantes(map: Map<*,*>): Estudiante{
        return Estudiante(
            id = map["_id"] as? String ?: "",
            nombreEstudiante = map["nombreEstudiante"] as? String ?: "",
            apellidoEstudiante = map["apellidoEstudiante"] as? String ?: "",
            tipoDocumento = map["tipoDocumento"] as? String ?: "",
            numeroDocumento = map["numeroDocumento"] as? String ?: "",
            fechaNacimientoString = map["fecaNacimineto"] as? String ?: "",
            generoEstudiante = map["generoEstudiante"] as? String ?: "",
            unidadId = map["unidadId"] as? String ?: "",
            colegioId = map["colegioId"] as? String ?: "",
            estadoEstudiante = map["estadoEstudiante"] as? Boolean ?: true,
            ediciones = map["ediciones"] as? List<String> ?: emptyList(),
            calificaciones = map["calificaciones"] as? List<String> ?: emptyList(),
            asistencias = map["asistencias"] as? List<String> ?: emptyList(),
            certificados = map["certificados"] as? List<String> ?: emptyList()
        )
    }



}