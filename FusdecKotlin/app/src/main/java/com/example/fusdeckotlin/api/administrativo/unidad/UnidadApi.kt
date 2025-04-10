package com.example.fusdeckotlin.api.administrativo.unidad

import com.example.fusdeckotlin.dto.administrativo.unidad.CreateUnidadDto
import com.example.fusdeckotlin.dto.administrativo.unidad.UpdateUnidadDto
import com.example.fusdeckotlin.models.administrativo.unidad.Unidad
import retrofit2.Response
import retrofit2.http.*

interface UnidadApi {
    @GET("api/unidades")
    suspend fun getUnidades(): Response<List<Unidad>>

    @POST("api/unidades")
    suspend fun createUnidad(@Body data: CreateUnidadDto): Response<Unidad>

    @PUT("api/unidades/{id}")
    suspend fun updateUnidad(@Path("id") id: String, @Body data: UpdateUnidadDto): Response<Unidad>

    @GET("api/unidades/{id}")
    suspend fun getUnidadById(@Path("id") id: String): Response<Unidad>

    @DELETE("api/unidades/{id}")
    suspend fun deleteUnidadById(@Path("id") id: String): Response<Unidad>
}