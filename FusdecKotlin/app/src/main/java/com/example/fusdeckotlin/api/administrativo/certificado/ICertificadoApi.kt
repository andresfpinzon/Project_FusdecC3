package com.example.fusdeckotlin.api.administrativo.certificado


import com.example.fusdeckotlin.dto.administrativo.certificado.CreateCertificadoDto
import com.example.fusdeckotlin.dto.administrativo.certificado.UpdateCertificadoDto
import models.administrativo.c.CertificadoModel
import retrofit2.http.*
import retrofit2.Response


interface ICertificadoApi {

    @GET("api/certificados")
    suspend fun getCertificados(): Response<List<CertificadoModel>>

    @POST("api/certificados")
    suspend fun createCertificado(@Body data: CreateCertificadoDto): Response<CertificadoModel>

    @PUT("api/certificados/{id}")
    suspend fun updateCertificado(
        @Path("id") id: String,
        @Body data: UpdateCertificadoDto
    ): Response<CertificadoModel>

    @GET("api/certificados/{id}")
    suspend fun getCertificadoById(@Path("id") id: String): Response<CertificadoModel>

    @DELETE("api/certificados/{id}")
    suspend fun deleteCertificadoById(@Path("id") id: String): Response<CertificadoModel>
}