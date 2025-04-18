package com.example.fusdeckotlin.dto.administrativo.auditoria

import com.google.gson.annotations.SerializedName

data class UpdateAuditoriaDto(
    @SerializedName("nombreEmisor")
    private val nombreEmisor: String? = null,
    @SerializedName("certificadoId")
    private val certificadoId: String? = null,
)
