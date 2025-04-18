package com.example.fusdeckotlin.api.administrativo.certificado


import com.example.fusdeckotlin.dto.administrativo.certificado.CreateCertificadoDto
import com.example.fusdeckotlin.dto.administrativo.certificado.UpdateCertificadoDto
import com.example.fusdeckotlin.models.administrativo.certificado.CertificadoModel

import retrofit2.http.*
import retrofit2.Response


interface CertificadoApi {

    @GET("api/certificados")
    suspend fun getCertificados(): Response<List<Certificado>>

    @POST("api/certificados")
    suspend fun createCertificado(@Body data: CreateCertificadoDto): Response<Certificado>

    @PUT("api/certificados/{id}")
    suspend fun updateCertificado(
        @Path("id") id: String,
        @Body data: UpdateCertificadoDto
    ): Response<Certificado>

    @GET("api/certificados/{id}")
    suspend fun getCertificadoById(@Path("id") id: String): Response<Certificado>

    @DELETE("api/certificados/{id}")
    suspend fun deleteCertificadoById(@Path("id") id: String): Response<Certificado>
}