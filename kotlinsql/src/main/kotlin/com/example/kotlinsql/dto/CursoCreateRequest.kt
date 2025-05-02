package com.example.kotlinsql.dto

import jakarta.validation.constraints.NotBlank

class CursoCreateRequest (

    @NotBlank(message = "El Nombre es obligatorio")
    val nombre: String,

    @NotBlank(message = "La descripcion es obligatoria")
    val descripcion: String,

    @NotBlank(message = "La intencidad horaria es obligatoria")
    val intensidadHoraria: String,

    @NotBlank(message = "El id de la fundación es obligatorio")
    val fundacionId: Int,

)