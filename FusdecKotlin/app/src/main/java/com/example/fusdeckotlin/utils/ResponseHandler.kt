package com.example.fusdeckotlin.utils

import android.util.Log
import retrofit2.Response

object ResponseHandler {

    fun <T> handleResponse(response: Response<T>): Result<T> {
        return if (response.isSuccessful) {
            try {
                response.body()?.let {
                    Result.success(it)
                } ?: Result.failure(Exception("Respuesta vacía del servidor"))
            } catch (e: Exception) {
                Log.e("API_ERROR", "Error parsing response: ${e.message}")
                Log.e("API_ERROR", "Response body: ${response.errorBody()?.string()}")
                Result.failure(Exception("Error procesando la respuesta del servidor"))
            }
        } else {
            val errorMsg = response.errorBody()?.string() ?: response.message()
            Result.failure(Exception("Error ${response.code()}: $errorMsg"))
        }
    }

    fun <T> handleListResponse(
        response: Response<List<T>>,
        transform: (List<T>) -> List<T> = { it }
    ): Result<List<T>> {
        return if (response.isSuccessful) {
            response.body()?.let {
                Result.success(transform(it))
            } ?: Result.failure(Exception("Respuesta vacía del servidor"))
        } else {
            val errorMsg = response.errorBody()?.string() ?: response.message()
            Result.failure(Exception("Error ${response.code()}: $errorMsg"))
        }
    }
}