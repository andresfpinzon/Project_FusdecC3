package com.example.kotlinsql.dto

import jakarta.validation.constraints.*

data class CalificacionCreateRequest(
    @NotBlank(message = "El título es obligatorio")
    val titulo: String,

    @NotNull(message = "Debe especificar si fue aprobado")
    val aprobado: Boolean,

    val usuarioId: String? = null,

    @NotBlank(message = "La edición es obligatoria")
    val edicion: String,

    @NotBlank(message = "La unidad es obligatoria")
    val unidad: String
)
