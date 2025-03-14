package models.administrativo.colegio

import java.util.*

class ColegioServicio(){

    companion object{
        fun crearColegio(
            colegios: MutableList<Colegio>,
            id: String,
            nombreColegio: String,
            emailColegio: String,
            estadoColegio: Boolean = true,
            estudiantes: List<String> = emptyList()
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
            return colegios.filter { it.estadoColegio }
        }

        fun obtenerColegioPorId(colegios: List<Colegio>, id: String): Colegio {
            return colegios.find { it.id == id } ?: throw NoSuchElementException("Colegio no encontrado")
        }

        fun actualizarColegio(
            colegios: MutableList<Colegio>,
            id: String,
            nombreColegio: String? = null,
            emailColegio: String? = null,
            estadoColegio: Boolean? = null,
            estudiantes: List<String>? = null
        ): Colegio {
            val colegio = colegios.find { it.id == id } ?: throw NoSuchElementException("Colegio no encontrado")

            colegio.nombreColegio = nombreColegio ?: colegio.nombreColegio
            colegio.emailColegio = emailColegio ?: colegio.emailColegio
            colegio.estadoColegio = estadoColegio ?: colegio.estadoColegio
            colegio.estudiantes = estudiantes ?: colegio.estudiantes

            return colegio
        }

        fun desactivarColegio(colegios: MutableList<Colegio>, id: String): Colegio {
            val colegio = colegios.find { it.id == id } ?: throw NoSuchElementException("Colegio no encontrado")
            colegio.estadoColegio = false
            return colegio
        }
    }
}