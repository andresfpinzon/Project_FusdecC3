package com.example.fusdeckotlin.services.administrativo.brigada

import com.example.fusdeckotlin.api.administrativo.brigada.BrigadaApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.brigada.CreateBrigadaDto
import com.example.fusdeckotlin.dto.administrativo.brigada.UpdateBrigadaDto
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class BrigadaServices {

    private val brigadaApi : BrigadaApi = RetrofitClient.brigadaApi

    suspend fun createBrigada(data: CreateBrigadaDto): Result<Brigada>{
        return  try {
            val req = data
            val res = brigadaApi.createBrigada(req)
            handleResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getBrigadasActives(): Result<List<Brigada>>{
        return  try {
            val res = brigadaApi.getBrigadas()
            handleListResponse(res) {it.filter{brigada -> brigada.getEstadoBrigada() == true}}
        }catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getBrigadaById(id: String): Result<Brigada>{
        return try {
            val res = brigadaApi.getBrigadaById(id)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun updateBrigada(id:String, data: UpdateBrigadaDto): Result<Brigada> {
        return try {
            val req = data
            val res = brigadaApi.updateBrigada(id,req)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun deleteBrigadaById(id: String): Result<Brigada>{
        return try {
            val res = brigadaApi.deleteBrigadaByid(id)
            if( res .isSuccessful){
                res.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Respuesta: Vacio el servidor"))
            }else {
                when (res.code()){
                    404 -> Result.failure(Exception("Asistencia no encontrada"))
                    else -> Result.failure(Exception("Error del servidor: ${res.code()}"))
                }
            }
        }catch (e: Exception){
            Result.failure(e)
        }
    }

    /*
    companion object {
        fun crearBrigada(
            brigadas: MutableList<Brigada>,
            id: String,
            nombreBrigada: String,
            ubicacionBrigada: String,
            estadoBrigada: Boolean =true,
            comandoId: String,
            unidades: List<String> = emptyList()
        ): Brigada {
            if (nombreBrigada.isBlank() || ubicacionBrigada.isBlank() || comandoId.isBlank() || unidades.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreBrigada, ubicacionBrigada, comandoId, unidades")
            }

            val nuevaBrigada = Brigada(
                id = id,
                nombreBrigada = nombreBrigada,
                ubicacionBrigada = ubicacionBrigada,
                estadoBrigada = estadoBrigada,
                comandoId = comandoId,
                unidades = unidades
            )

            brigadas.add(nuevaBrigada)
            return nuevaBrigada
        }

        fun listarBrigadasActivas(brigadas: List<Brigada>): List<Brigada> {
            return brigadas.filter { it.getEstadoBrigada() }
        }

        fun obtenerBrigadaPorId(brigadas: List<Brigada>, id: String): Brigada {
            return brigadas.find { it.getId() == id } ?: throw NoSuchElementException("Brigada no encontrada")
        }

        fun actualizarBrigada(
            brigadas: MutableList<Brigada>,
            id: String,
            nombreBrigada: String? = null,
            ubicacionBrigada: String? = null,
            comandoId: String? = null,
            unidades: List<String>? = null,
            estadoBrigada: Boolean
        ): Brigada {
            val brigada = brigadas.find { it.getId() == id } ?: throw NoSuchElementException("Brigada no encontrada")

            nombreBrigada?.let { brigada.setNombreBrigada(it) }
            ubicacionBrigada?.let { brigada.setUbicacionBrigada(it) }
            comandoId?.let { brigada.setComandoId(it) }
            unidades?.let { brigada.setUnidades(it) }
            brigada.setEstadoBrigada(estadoBrigada)

            return brigada
        }

        fun desactivarBrigada(brigadas: MutableList<Brigada>, id: String): Brigada {
            val brigada = brigadas.find { it.getId() == id } ?: throw NoSuchElementException("Brigada no encontrada")
            brigada.setEstadoBrigada(false)
            return brigada
        }
    }

     */
}