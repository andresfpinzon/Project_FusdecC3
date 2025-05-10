package com.example.kotlinsql.dto.comando

import jakarta.validation.constraints.*

data class ComandoUpdateRequest(
    @field:Size(min = 3, max = 50, message = "El nombre del comando debe tener entre 3 y 50 caracteres")
    val nombreComando: String? = null,

    val ubicacionComando: String? = null,

    val estadoComando: Boolean? = null,

    @field:Positive(message = "El ID de la fundación debe ser un número positivo")
    val fundacionId: Int? = null
) {
    fun normalizar(): ComandoUpdateRequest {
        return this.copy(
            nombreComando = this.nombreComando?.lowercase()?.trim(),
            ubicacionComando = this.ubicacionComando?.trim()
        )
    }

    fun isEmpty(): Boolean {
        return nombreComando == null &&
                ubicacionComando == null &&
                estadoComando == null &&
                fundacionId == null
    }
}