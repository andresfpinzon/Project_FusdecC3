package com.example.fusdeckotlin.services.administrativo.auditoria

import com.example.fusdeckotlin.api.administrativo.auditoria.AuditoriaApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.models.administrativo.auditoria.Auditoria
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse

class AuditoriaServices {

    private val auditoriaApi : AuditoriaApi = RetrofitClient.auditoriaApi

    suspend fun getAuditorias(): Result<List<Auditoria>>{
        return  try {
            val res = auditoriaApi.getAuditorias()
            handleListResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }


    suspend fun getAuditoria(id: String): Result<Auditoria>{
        return try {
            val res = auditoriaApi.getAuditoriaById(id)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getAuditoriaByCertificadoId(id: String): Result<Auditoria>{
        return  try {
            val res = auditoriaApi.getAuditoriaByCertificadoId(id)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

//    companion object{
//        fun createAuditoria(auditoriaDB: MutableList<AuditoriaModel>, data: AuditoriaModel): AuditoriaModel{
//            val newAuditoria = AuditoriaModel(
//                nombreEmisor = data.getNombreEmisorAuditoria(),
//            )
//
//            auditoriaDB.add(newAuditoria)
//            return newAuditoria
//        }
//
//        fun removeAuditoriaById(auditoriaDB: MutableList<AuditoriaModel>, id: String): Boolean{
//            val auditoria = auditoriaDB.find { it.getIdAuditoria() == id }
//            return if(auditoria != null){
//                auditoriaDB.remove(auditoria)
//            }else {
//                false
//            }
//        }
//    }

}