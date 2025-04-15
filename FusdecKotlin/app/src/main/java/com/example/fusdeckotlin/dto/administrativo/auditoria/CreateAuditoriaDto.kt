package com.example.fusdeckotlin.dto.administrativo.auditoria

import com.google.gson.annotations.SerializedName

data class CreateAuditoriaDto(
    private val nombreEmisor: String,
    @SerializedName("certificadoId")
    private val certificadoId: String,
)
