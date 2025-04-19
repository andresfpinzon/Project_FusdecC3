package com.example.fusdeckotlin.services.administrativo.userRolServices

import com.example.fusdeckotlin.api.administrativo.userRol.IUserRolApi
import com.example.fusdeckotlin.config.retrofit.RetrofitClient
import com.example.fusdeckotlin.dto.administrativo.userRol.AddRolUserDto
import com.example.fusdeckotlin.models.administrativo.userRol.UserRolModel
import com.example.fusdeckotlin.utils.ResponseHandler.handleListResponse
import com.example.fusdeckotlin.utils.ResponseHandler.handleResponse

class UserRolServices {

    private val userRolApi: IUserRolApi = RetrofitClient.userRolApi

    suspend fun getRolesOfUser(): Result<List<UserRolModel>>{
        return try {
            val res = userRolApi.getRolesOfUsers()
            handleListResponse(res)
        }catch (e: Exception){
            Result.failure(e)
        }
    }
    suspend fun addRolToUser(data: AddRolUserDto): Result<UserRolModel>{
        return try {
            val res = userRolApi.addRolToUser(data)
            handleResponse(res)
        }catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getRoleByUser(document: String): Result<UserRolModel> {
        return try {
            val res = userRolApi.getRolByDocumentUser(document)
            handleResponse(res)
        }catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun delteRoleOfUser(document: String, role: String): Result<UserRolModel>{
        return  try {
            val res = userRolApi.deleteRolToUser(document, role)
            handleResponse(res)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}