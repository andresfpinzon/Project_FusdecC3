package com.example.fusdeckotlin.services.administrativoService.colegio

import com.example.fusdeckotlin.models.administrativo.colegio.Colegio

class ColegioServices() {

    companion object {
        fun crearColegio(
            colegios: MutableList<Colegio>,
            id: String,
            nombreColegio: String,
            emailColegio: String,
            estadoColegio: Boolean,
            estudiantes: List<String>
        ): Colegio {
            if (nombreColegio.isBlank() || estudiantes.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreColegio, estudiantes")
            }

            val nuevoColegio = Colegio(
                id = id,
                nombreColegio = nombreColegio,
                emailColegio = emailColegio,
                estadoColegio = estadoColegio,
                estudiantes = estudiantes
            )

            colegios.add(nuevoColegio)
            return nuevoColegio
        }

        fun listarColegiosActivos(colegios: List<Colegio>): List<Colegio> {
            return colegios.filter { it.getEstadoColegio() }
        }

        fun obtenerColegioPorId(colegios: List<Colegio>, id: String): Colegio {
            return colegios.find { it.getId() == id } ?: throw NoSuchElementException("Colegio no encontrado")
        }

        fun actualizarColegio(
            colegios: MutableList<Colegio>,
            id: String,
            nombreColegio: String? = null,
            emailColegio: String? = null,
            estadoColegio: Boolean? = null,
            estudiantes: List<String>? = null
        ): Colegio {
            val colegio = colegios.find { it.getId() == id } ?: throw NoSuchElementException("Colegio no encontrado")

            nombreColegio?.let { colegio.setNombreColegio(it) }
            emailColegio?.let { colegio.setEmailColegio(it) }
            estadoColegio?.let { colegio.setEstadoColegio(it) }
            estudiantes?.let { colegio.setEstudiantes(it) }

            return colegio
        }

        fun desactivarColegio(colegios: MutableList<Colegio>, id: String): Colegio {
            val colegio = colegios.find { it.getId() == id } ?: throw NoSuchElementException("Colegio no encontrado")
            colegio.setEstadoColegio(false)
            return colegio
        }
    }
}