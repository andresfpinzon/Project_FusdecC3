package com.example.fusdeckotlin.services.administrativo.colegio

import com.example.fusdeckotlin.models.administrativo.colegio.Colegio

class ColegioServices() {

    companion object {
        fun crearColegio(
            colegios: MutableList<Colegio>,
            id: String,
            nombreColegio: String,
            emailColegio: String,
            estadoColegio: Boolean,
            estudiantes: List<String>,
            direccionColegio: String
        ): Colegio {
            if (nombreColegio.isBlank() || estudiantes.isEmpty() || emailColegio.isBlank() || direccionColegio.isBlank()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreColegio, estudiantes, direccion")
            }

            val nuevoColegio = Colegio(
                id = id,
                nombreColegio = nombreColegio,
                emailColegio = emailColegio,
                estadoColegio = estadoColegio,
                estudiantes = estudiantes,
                direccionColegio = direccionColegio
            )

            colegios.add(nuevoColegio)
            return nuevoColegio
        }

        fun actualizarColegio(
            colegios: MutableList<Colegio>,
            id: String,
            nombreColegio: String? = null,
            emailColegio: String? = null,
            estadoColegio: Boolean? = null,
            estudiantes: List<String>? = null,
            direccionColegio: String? = null
        ): Colegio {
            val colegio = colegios.find { it.getId() == id } ?: throw NoSuchElementException("Colegio no encontrado")

            nombreColegio?.let { colegio.setNombreColegio(it) }
            emailColegio?.let { colegio.setEmailColegio(it) }
            estadoColegio?.let { colegio.setEstadoColegio(it) }
            estudiantes?.let { colegio.setEstudiantes(it) }
            direccionColegio?.let { colegio.setDireccionColegio(it) }

            return colegio
        }

        fun listarColegiosActivos(colegios: List<Colegio>): List<Colegio> {
            return colegios.filter { it.getEstadoColegio() }
        }

        fun obtenerColegioPorId(colegios: List<Colegio>, id: String): Colegio {
            return colegios.find { it.getId() == id } ?: throw NoSuchElementException("Colegio no encontrado")
        }

        fun desactivarColegio(colegios: MutableList<Colegio>, id: String) {
            val colegio = colegios.find { it.getId() == id } ?: throw NoSuchElementException("Colegio no encontrado")
            colegio.setEstadoColegio(false)
        }
    }
}