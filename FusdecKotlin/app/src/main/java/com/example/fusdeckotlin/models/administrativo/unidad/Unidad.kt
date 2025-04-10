
package com.example.fusdeckotlin.models.administrativo.unidad
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.models.secretario.estudiante.Estudiante
import com.google.gson.annotations.SerializedName

data class Unidad(
    @SerializedName("_id")
    private val id: String? = null,
    @SerializedName("nombreUnidad")
    private var nombreUnidad: String,
    @SerializedName("brigadaId")
    private var brigadaId: String,
    @SerializedName("estadoUnidad")
    private var estadoUnidad: Boolean = true,
    @SerializedName("usuarioId")
    private var usuarioId: String,
    @SerializedName("comandos")
    private var comandos: List<Any>,
    @SerializedName("estudiantes")
    private var estudiantes: List<Any>
) {
    fun getId() = id
    fun getNombreUnidad() = nombreUnidad
    fun getBrigadaId() = brigadaId
    fun getEstadoUnidad() = estadoUnidad
    fun getUsuarioId() = usuarioId

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
                is Map<*, *> -> convertMaptoComandos(it)
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

    private fun convertMaptoComandos(map: Map<*,*>): Comando {
        return Comando (
            id = map["_id"] as? String ?: "",
            nombreComando = map["nombreComando"] as? String ?: "",
            estadoComando = map["estadoComando"] as? Boolean ?: true,
            ubicacionComando = map["ubicacionComando"] as? String ?: "",
            fundacionId = map["fundacionId"] as? String ?: "",
            brigadas = map["brigadas"] as? List<String> ?: emptyList()
        )
    }

    fun getEstudiantes(): List<Estudiante>{
        return estudiantes.mapNotNull {
            when (it) {
                is Estudiante -> it
                is String -> Estudiante(id = it, "", "", "", "", "", "", "", "", "", true, emptyList(), emptyList(),
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
            correoEstudiante = map["correoEstudiante"] as? String ?: "",
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