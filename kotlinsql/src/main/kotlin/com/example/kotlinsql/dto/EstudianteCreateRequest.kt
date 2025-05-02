package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class EstudianteCreateRequest(
    @NotBlank(message = "El número de documento es obligatorio")
    val numeroDocumento: String,

    @NotBlank(message = "El nombre es obligatorio")
    val nombre: String,

    @NotBlank(message = "El apellido es obligatorio")
    val apellido: String,

    @NotBlank(message = "El tipo de documento es obligatorio")
    val tipoDocumento: String,

    @NotBlank(message = "El género es obligatorio")
    val genero: String,

    @NotBlank(message = "El grado es obligatorio")
    val grado: String,

    @NotNull(message = "El ID de unidad es obligatorio")
    val unidadId: Int,

    @NotNull(message = "El ID de colegio es obligatorio")
    val colegioId: Int,

    @NotNull(message = "El ID de edición es obligatorio")
    val edicionId: Int
)