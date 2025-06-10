package com.example.fusdeckotlin.api.root.fundacion

import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path

interface FundacionApi {

    @GET("/fundaciones")
    suspend fun listarFundaciones(): Response<List<Fundacion>>

    @GET("/fundaciones/{id}")
    suspend fun obtenerFundacionPorId(@Path("id") id: String): Response<Fundacion>
}