package com.example.fusdeckotlin.api.administrativo.certificado


import com.example.fusdeckotlin.dto.administrativo.certificado.CreateCertificadoDto
import com.example.fusdeckotlin.dto.administrativo.certificado.UpdateCertificadoDto
import com.example.fusdeckotlin.models.administrativo.certificado.Certificado

import retrofit2.http.*
import retrofit2.Response


interface CertificadoApi {

    @GET("certificados")
    suspend fun getCertificados(): Response<List<Certificado>>

    @POST("certificados")
    suspend fun createCertificado(@Body data: CreateCertificadoDto): Response<Certificado>

    @PUT("certificados/{id}")
    suspend fun updateCertificado(
        @Path("id") id: String,
        @Body data: UpdateCertificadoDto
    ): Response<Certificado>

    @GET("certificados/{id}")
    suspend fun getCertificadoById(@Path("id") id: String): Response<Certificado>

    @DELETE("certificados/{id}")
    suspend fun deleteCertificadoById(@Path("id") id: String): Response<Certificado>
}