package com.example.fusdeckotlin.services.administrativo.auditoria

import com.example.fusdeckotlin.api.administrativo.auditoria.IAuditoriaApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import models.administrativo.auditoria.model.AuditoriaModel
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse

class AuditoriaServices {

    private val auditoriaApi : IAuditoriaApi = RetrofitClient.auditoriaApi

    suspend fun getAuditorias(): Result<List<AuditoriaModel>>{
        return  try {
            val res = auditoriaApi.getAuditorias()
            handleListResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }


    suspend fun getAuditoria(id: String): Result<AuditoriaModel>{
        return try {
            val res = auditoriaApi.getAuditoriaById(id)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getAuditoriaByCertificadoId(id: String): Result<AuditoriaModel>{
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