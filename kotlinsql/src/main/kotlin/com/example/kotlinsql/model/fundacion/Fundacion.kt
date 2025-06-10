package com.example.kotlinsql.model.fundacion

import jakarta.persistence.*

@Entity
data class Fundacion(
    @Id
    val id: Long? = null,
    val nombre: String,
    val estado: Boolean = true
)
