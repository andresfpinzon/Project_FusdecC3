package com.example.kotlinsql.model.unidad

import jakarta.persistence.*

@Entity
@Table(name = "unidad")
data class Unidad(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidad")
    val id: Long? = null,

    @Column(name = "nombre_unidad")
    val nombreUnidad: String,

    @Column(name = "estado_unidad")
    val estadoUnidad: Boolean = true,

    @Column(name = "brigada_id", nullable = true)
    val brigadaId: Int? = null,

    @Column(name = "usuario_id")
    val usuarioId: String
) {
    constructor() : this(null, "", true, null, "")
}