package com.example.fusdeckotlin.services.administrativo.unidad

import com.example.fusdeckotlin.api.administrativo.unidad.UnidadApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.unidad.CreateUnidadDto
import com.example.fusdeckotlin.dto.administrativo.unidad.UpdateUnidadDto
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
class UnidadServices {

    private val unidadApi: UnidadApi = RetrofitClient.unidadApi

    suspend fun createUnidadServices(data: CreateUnidadDto): Result<Unidad>{
        return  try {
            val res = unidadApi.createUnidad(data)
            handleResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun updateUnidadServices(id: String, data: UpdateUnidadDto): Result<Unidad>{
        return try {
            val res = unidadApi.updateUnidad(id, data)
            handleResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getUnidadActives(): Result<List<Unidad>>{
        return try {
            val res = unidadApi.getUnidades()
            handleListResponse(res){it.filter { unidad -> unidad.getEstadoUnidad() == true   }}
        } catch (e: Exception){
            Result.failure(e)
        }

    }

    suspend fun getUnidadById(id: String): Result<Unidad>{
        return try {
            val res = unidadApi.getUnidadById(id)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun deleteUnidadById(id: String): Result<Unidad>{

        return  try {
            val res = unidadApi.deleteUnidadById(id)
            if(res.isSuccessful){
                res.body()?.let {
                    Result.success(it)
                }?: Result.failure(Exception("Respuesta: Vacio el servidor"))
            }else {
                when (res.code()){
                    404 -> Result.failure(Exception("Unidad no encontrado"))
                    else -> Result.failure(Exception("Error del servidor: ${res.code()}"))
                }
            }
        }catch (e: Exception){
            Result.failure(e)
        }

    }

//    companion object {
//        fun crearUnidad(
//            unidades: MutableList<Unidad>,
//            id: String,
//            nombreUnidad: String,
//            brigadaId: String,
//            estadoUnidad: Boolean,
//            usuarioId: String,
//            comandos: List<String>,
//            estudiantes: List<String>
//        ): Unidad {
//            if (nombreUnidad.isBlank() || brigadaId.isBlank() || usuarioId.isBlank()) {
//                throw IllegalArgumentException("Todos los campos son obligatorios")
//            }
//
//            val nuevaUnidad = Unidad(
//                id = id,
//                nombreUnidad = nombreUnidad,
//                brigadaId = brigadaId,
//                estadoUnidad = estadoUnidad,
//                usuarioId = usuarioId,
//                comandos = comandos,
//                estudiantes = estudiantes
//            )
//            unidades.add(nuevaUnidad)
//            return nuevaUnidad
//        }
//
//        fun actualizarUnidad(
//            unidades: MutableList<Unidad>,
//            id: String,
//            nombreUnidad: String?,
//            brigadaId: String?,
//            estadoUnidad: Boolean?,
//            usuarioId: String?,
//            comandos: List<String>?,
//            estudiantes: List<String>?
//        ): Unidad {
//            val unidad = obtenerUnidadPorId(unidades, id)
//            nombreUnidad?.let { unidad.setNombreUnidad(it) }
//            brigadaId?.let { unidad.setBrigadaId(it) }
//            estadoUnidad?.let { unidad.setEstadoUnidad(it) }
//            usuarioId?.let { unidad.setUsuarioId(it) }
//            comandos?.let { unidad.setComandos(it) }
//            estudiantes?.let { unidad.setEstudiantes(it) }
//            return unidad
//        }
//
//        fun desactivarUnidad(unidades: MutableList<Unidad>, id: String): Unidad {
//            val unidad = obtenerUnidadPorId(unidades, id)
//            unidad.setEstadoUnidad(false)
//            return unidad
//        }
//
//        fun obtenerUnidadPorId(unidades: List<Unidad>, id: String): Unidad {
//            return unidades.firstOrNull { it.getId() == id }
//                ?: throw NoSuchElementException("Unidad no encontrada")
//        }
//
//        fun listarUnidadesActivas(unidades: List<Unidad>): List<Unidad> {
//            return unidades.filter { it.getEstadoUnidad() }
//        }
//    }
}