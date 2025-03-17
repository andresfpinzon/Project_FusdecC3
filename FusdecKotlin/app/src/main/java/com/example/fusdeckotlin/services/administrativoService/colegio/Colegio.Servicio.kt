package models.administrativo.colegio

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
            nombreColegio: String,
            emailColegio: String,
            estadoColegio: Boolean,
            estudiantes: List<String>
        ): Colegio {
            val colegio = colegios.find { it.id == id } ?: throw NoSuchElementException("Colegio no encontrado")
            if (nombreColegio.isBlank() || estudiantes.isEmpty()) {
                throw IllegalArgumentException("Faltan campos requeridos: nombreColegio, estudiantes")
            }

            colegio.nombreColegio = nombreColegio
            colegio.emailColegio = emailColegio
            colegio.estadoColegio = estadoColegio
            colegio.estudiantes = estudiantes

            return colegio
        }

        fun desactivarColegio(colegios: MutableList<Colegio>, id: String): Colegio {
            val colegio = colegios.find { it.id == id } ?: throw NoSuchElementException("Colegio no encontrado")
            colegio.estadoColegio = false
            return colegio
        }
    }
}