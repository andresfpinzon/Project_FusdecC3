package com.example.fusdeckotlin.services.administrativo.comando

import com.example.fusdeckotlin.api.administrativo.comando.ComandoApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.comando.CreateComandoDto
import com.example.fusdeckotlin.dto.administrativo.comando.UpdateComandoDto
import com.example.fusdeckotlin.models.administrativo.comando.Comando
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import kotlin.random.Random


class ComandoServices {

    private val comandoApi: ComandoApi = RetrofitClient.comandoApi

    suspend fun createBrigada(data: CreateComandoDto): Result<Comando>{
        return try {
            val req = data
            val res = comandoApi.createComando(req)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getBrigadasActives(): Result<List<Comando>>{
        return  try {
            val res = comandoApi.getComandos()
            handleListResponse(res) { it.filter {comando -> comando.getEstadoComando() == true}}
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getComandoById(id: String): Result<Comando>{
        return try {
            val res = comandoApi.getComandoById(id)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }


    suspend fun updateComando(id: String, data: UpdateComandoDto): Result<Comando>{
        return try {
            val req = data
            val res = comandoApi.updateComando(id, req)
            handleResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun deleteComandoById(id: String): Result<Comando>{
        return try {
            val res = comandoApi.deleteComandoById(id)
            if(res.isSuccessful){
                res.body()?.let {
                    Result.success(it)
                }?: Result.failure(Exception("Respuesta: Vacio el servidor"))
            }else {
                when (res.code()){
                    404 -> Result.failure(Exception("Comando no encontrado"))
                    else -> Result.failure(Exception("Error del servidor: ${res.code()}"))
                }
            }
        }catch (e: Exception){
            Result.failure(e)
        }
    }
//    companion object {
//        fun crearComando(
//            comandos: MutableList<Comando>,
//            id: String,
//            nombreComando: String,
//            estadoComando: Boolean = true,
//            ubicacionComando: String,
//            fundacionId: String,
//            brigadas: List<String> = emptyList()
//        ): Comando {
//            if (nombreComando.isBlank() || brigadas.isEmpty()) {
//                throw IllegalArgumentException("Faltan campos requeridos: nombreComando, brigadas")
//            }
//
//            val nuevoComando = Comando(
//                id = id,
//                nombreComando = nombreComando,
//                estadoComando = estadoComando,
//                ubicacionComando = ubicacionComando,
//                fundacionId = fundacionId,
//                brigadas = brigadas
//            )
//
//            comandos.add(nuevoComando)
//            return nuevoComando
//        }
//
//        fun listarComandosActivos(comandos: List<Comando>): List<Comando> {
//            return comandos.filter { it.getEstadoComando() }
//        }
//
//        fun obtenerComandoPorId(comandos: List<Comando>, id: String): Comando {
//            return comandos.find { it.getId() == id } ?: throw NoSuchElementException("Comando no encontrado")
//        }
//
//        fun actualizarComando(
//            comandos: MutableList<Comando>,
//            id: String,
//            nombreComando: String? = null,
//            estadoComando: Boolean? = null,
//            ubicacionComando: String? = null,
//            fundacionId: String? = null,
//            brigadas: List<String>? = null
//        ): Comando {
//            val comando = comandos.find { it.getId() == id } ?: throw NoSuchElementException("Comando no encontrado")
//
//            nombreComando?.let { comando.setNombreComando(it) }
//            estadoComando?.let { comando.setEstadoComando(it) }
//            ubicacionComando?.let { comando.setUbicacionComando(it) }
//            fundacionId?.let { comando.setFundacionId(it) }
//            brigadas?.let { comando.setBrigadas(it) }
//
//            return comando
//        }
//
//        fun desactivarComando(comandos: MutableList<Comando>, id: String): Comando {
//            val comando = comandos.find { it.getId() == id } ?: throw NoSuchElementException("Comando no encontrado")
//            comando.setEstadoComando(false)
//            return comando
//        }
//    }
}