package com.example.fusdeckotlin.services.root.fundacion

import com.example.fusdeckotlin.models.root.fundacion.Fundacion
import java.time.LocalDate


class FundacionServicio(){

    companion object {
        fun crearFundacion(
            fundaciones: MutableList<Fundacion>,
            id: String,
            nombreFundacion: String,
            estadoFundacion: Boolean = true,
            comandos: List<String> = emptyList()
        ): Fundacion{
            if (nombreFundacion.isBlank() || comandos.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos:nombreFundacion, comandos")
            }

            val nuevaFundacion = Fundacion(
                id = id,
                nombreFundacion =nombreFundacion,
                estadoFundacion= estadoFundacion,
                comandos = comandos
            )

            fundaciones.add(nuevaFundacion)
            return nuevaFundacion
        }

        fun listarFundacionesActivas(fundaciones: List<Fundacion>): List<Fundacion> {
            return fundaciones.filter { it.getEstadoFundacion() }
        }

        fun obtenerFundacionPorId(fundaciones: List<Fundacion>, id: String): Fundacion{
            return fundaciones.find { it.getId() == id } ?: throw NoSuchElementException("Fundacion no encontrada")
        }

        fun actualizarFundacion(
            fundaciones: MutableList<Fundacion>,
            id: String,
            nombreFundacion: String? = null,
            estadoFundacion: Boolean? = null,
            comandos: List<String>? = null
        ): Fundacion{
            val fundacion = fundaciones.find { it.getId() == id } ?: throw NoSuchElementException("Fundacion no encontrada")

            nombreFundacion?.let { fundacion.setNombreFundacion(it) }
            estadoFundacion?.let { fundacion.setEstadoFundacion(it) }
            comandos?.let { fundacion.setComandos(it) }

            return fundacion
        }

        fun desactivarFundacion(fundaciones: MutableList<Fundacion>, id: String): Fundacion{
            val fundacion = fundaciones.find { it.getId() == id } ?: throw NoSuchElementException("Fundacion no encontrada")
            fundacion.setEstadoFundacion(false)
            return  fundacion
        }
    }
}

