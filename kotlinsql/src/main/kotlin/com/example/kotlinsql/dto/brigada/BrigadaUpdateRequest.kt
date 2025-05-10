package com.example.kotlinsql.dto.brigada

import jakarta.validation.constraints.*

data class BrigadaUpdateRequest(
    @field:Size(min = 3, max = 100, message = "El nombre de la brigada debe tener entre 3 y 100 caracteres")
    val nombreBrigada: String? = null,

    val ubicacionBrigada: String? = null,

    val estadoBrigada: Boolean? = null,

    val comandoId: Int? = null
) {
    fun normalizar(): BrigadaUpdateRequest {
        return this.copy(
            nombreBrigada = this.nombreBrigada?.lowercase()?.trim(),
            ubicacionBrigada = this.ubicacionBrigada?.trim()
        )
    }

    fun isEmpty(): Boolean {
        return nombreBrigada == null &&
                ubicacionBrigada == null &&
                estadoBrigada == null &&
                comandoId == null
    }
}