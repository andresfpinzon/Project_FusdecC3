package com.example.fusdeckotlin.services.root.fundacion

import com.example.fusdeckotlin.api.root.fundacion.FundacionApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class FundacionService {

    private val api: FundacionApi = RetrofitClient.fundacionApi

    suspend fun listarTodasLasFundaciones(): Result<List<Fundacion>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = api.listarFundaciones()
                handleListResponse(response)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

    suspend fun obtenerFundacionPorId(id: Int): Result<Fundacion> {
        return withContext(Dispatchers.IO) {
            try {
                val response = api.obtenerFundacionPorId(id)
                handleResponse(response)
            } catch (e: Exception) {
                Result.failure(e)
            }
        }
    }

}