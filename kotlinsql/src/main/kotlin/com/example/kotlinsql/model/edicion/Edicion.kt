package com.example.kotlinsql.model.edicion

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDate

@Entity
@Table(name = "edicion")
data class Edicion(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    var titulo: String,

    var fechaInicio: LocalDate,

    var fechaFin: LocalDate,

    @Column(name = "curso_id", nullable = true, insertable = true, updatable = true)
    var cursoId: Int? = null,

    val estado: Boolean = true
)