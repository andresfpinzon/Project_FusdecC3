package com.example.fusdeckotlin.services.administrativo.certificate

import com.example.fusdeckotlin.api.administrativo.certificado.CertificadoApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.certificado.CreateCertificadoDto
import com.example.fusdeckotlin.dto.administrativo.certificado.UpdateCertificadoDto
import com.example.fusdeckotlin.models.administrativo.certificado.Certificado

import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class CertificadoServices {

    private val certificadoApi : CertificadoApi = RetrofitClient.certificadoApi

    suspend fun createCertificado(data: CreateCertificadoDto): Result<Certificado> {
        return try {
            val res = certificadoApi.createCertificado(data)
            handleResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun updateCertificate(id: String, data: UpdateCertificadoDto): Result<Certificado> {
        return try {
            val res = certificadoApi.updateCertificado(id, data)
            handleResponse(res)
        } catch (e: Exception){
            Result.failure(e)
        }
    }

    suspend fun getCertificatesActives(): Result<List<Certificado>> {
        return try {
            val res = certificadoApi.getCertificados()
            handleListResponse(res) {it.filter { certificate -> certificate.getEstado() == true }}
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getCertficateById(id: String): Result<Certificado> {
        return  try {
            val res = certificadoApi.getCertificadoById(id)
            handleResponse(res)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }


    suspend fun deleteCertificateById(id: String): Result<Certificado> {
        return try {
            val res = certificadoApi.deleteCertificadoById(id)
            handleResponse(res)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}