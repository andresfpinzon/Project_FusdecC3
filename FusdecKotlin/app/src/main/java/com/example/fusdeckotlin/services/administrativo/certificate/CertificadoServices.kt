package com.example.fusdeckotlin.services.administrativo.certificate

import com.example.fusdeckotlin.api.administrativo.certificado.ICertificadoApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.certificado.CreateCertificadoDto
import com.example.fusdeckotlin.dto.administrativo.certificado.UpdateCertificadoDto
import models.administrativo.c.CertificadoModel

import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class CertificadoServices {

    private val certificadoApi : ICertificadoApi = RetrofitClient.certificadoApi

    suspend fun createCertificado(data: CreateCertificadoDto): Result<CertificadoModel> {
        return try {
            val res = certificadoApi.createCertificado(data)
            handleResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun updateCertificate(id: String, data: UpdateCertificadoDto): Result<CertificadoModel> {
        return try {
            val res = certificadoApi.updateCertificado(id, data)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getCertificatesActives(): Result<List<CertificadoModel>> {
        return try {
            val res = certificadoApi.getCertificados()
            handleListResponse(res) {it.filter { certificate -> certificate.getEstadoCertificado() == true }}
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getCertficateById(id: String): Result<CertificadoModel> {
        return  try {
            val res = certificadoApi.getCertificadoById(id)
            handleResponse(res)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }


    suspend fun deleteCertificateById(id: String): Result<CertificadoModel> {
        return try {
            val res = certificadoApi.deleteCertificadoById(id)
            handleResponse(res)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

//    companion object{
//        private val certificateDB = mutableListOf<CertificadoModel>()
//
//        fun createCertificate(data: CertificadoModel): CertificadoModel{
//            val newCertificate = CertificadoModel(
//                usuarioId = data.getUsuarioId(),
//                cursoId = data.getCursoId(),
//                estudianteId = data.getEstudianteId(),
//                nombreEmisorCertificado = data.getNombreEmisor()
//            )
//            certificateDB.add(newCertificate)
//
//            return newCertificate
//        }
//
//        fun actualizarCertificadoByCodeVerify(codeVerify: String, data: CertificadoModel): CertificadoModel?{
//            val existCertificate = getCertificateByCodeVerify(codeVerify)
//
//            existCertificate.setNombreEmisor(data.getNombreEmisor())
//            existCertificate.setEstadoCertificado(data.getEstadoCertificado())
//
//            return existCertificate
//        }
//
//        fun getCertificateByCodeVerify(codeVerify: String): CertificadoModel{
//            return certificateDB.first{ it.getCodigoVerificacion() == codeVerify}
//        }
//
//        fun getAllCertificatesActives(): List<CertificadoModel>{
//            return certificateDB.filter{ it.getEstadoCertificado() == true}
//        }
//
//        fun removeCertificateByCodeVerify(codeVerify: String): Boolean{
//            val certificate = getCertificateByCodeVerify(codeVerify)
//
//            return if(certificate != null){
//                certificateDB.remove(certificate)
//            }else{
//                false
//            }
//        }
//    }
}