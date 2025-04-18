package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank

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

    @NotBlank(message = "La unidad es obligatoria")
    val unidad: String,

    @NotBlank(message = "El colegio es obligatorio")
    val colegio: String,

    @NotBlank(message = "La edición es obligatoria")
    val edicion: String,

    @NotBlank(message = "El grado es obligatorio")
    val grado: String

)