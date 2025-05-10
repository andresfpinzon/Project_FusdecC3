package com.example.kotlinsql.model.curso

import jakarta.persistence.*

@Entity
@Table(name = "curso")
data class Curso(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int = 0,

    val nombre: String,

    val descripcion: String,

    val intensidadHoraria: String,

    val fundacionId: Int,

    val estado: Boolean = true
)