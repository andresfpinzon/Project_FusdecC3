package com.example.kotlinsql.model

class Curso (

    val id: Int,
    val nombre: String,
    val descripcion: String,
    val intensidadHoraria: String,
    val fundacionId: String,
    val estado: Boolean = true

)