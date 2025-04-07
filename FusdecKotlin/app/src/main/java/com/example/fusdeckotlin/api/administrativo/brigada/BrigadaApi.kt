package com.example.fusdeckotlin.api.administrativo.brigada

import com.example.fusdeckotlin.dto.administrativo.brigada.CreateBrigadaDto
import com.example.fusdeckotlin.dto.administrativo.brigada.UpdateBrigadaDto
import com.example.fusdeckotlin.models.administrativo.brigada.Brigada
import retrofit2.Response
import retrofit2.http.*

interface BrigadaApi {
    @GET("api/brigadas")
    suspend fun getBrigadas(): Response<List<Brigada>>

    @POST("api/brigadas")
    suspend fun createBrigada(@Body req: CreateBrigadaDto): Response<Brigada>

    @PUT("api/brigadas/{id}")
    suspend fun updateBrigada(
        @Path("id") id: String,
        @Body req: UpdateBrigadaDto
    ): Response<Brigada>

    @GET("api/brigadas/{id}")
    suspend fun getBrigadaById(@Path("id") id: String): Response<Brigada>


    @DELETE("api/brigadas/{id}")
    suspend fun deleteBrigadaByid(@Path("id") id: String): Response<Brigada>
}