package models.secretario.curso

import java.util.*

class Curso(
    private val id: String,
    private var nombreCurso: String,
    private var descripcionCurso: String,
    private var intensidadHorariaCurso: String,
    private var estadoCurso: Boolean = true,
    private var fundacionId: String,
    private var ediciones: List<String>
) {
    // Getters
    fun getId(): String = id
    fun getNombreCurso(): String = nombreCurso
    fun getDescripcionCurso(): String = descripcionCurso
    fun getIntensidadHorariaCurso(): String = intensidadHorariaCurso
    fun getEstadoCurso(): Boolean = estadoCurso
    fun getFundacionId(): String = fundacionId
    fun getEdiciones(): List<String> = ediciones

    // Setters
    fun setNombreCurso(nombre: String) {
        this.nombreCurso = nombre
    }

    fun setDescripcionCurso(descripcion: String) {
        this.descripcionCurso = descripcion
    }

    fun setIntensidadHorariaCurso(intensidad: String) {
        this.intensidadHorariaCurso = intensidad
    }

    fun setEstadoCurso(estado: Boolean) {
        this.estadoCurso = estado
    }

    fun setFundacionId(fundacion: String) {
        this.fundacionId = fundacion
    }

    fun setEdiciones(ediciones: List<String>) {
        this.ediciones = ediciones
    }

    companion object {
        val curso1 = Curso(
            id = "curso1",
            nombreCurso = "Primeros Auxilios Básicos",
            descripcionCurso = "Curso introductorio sobre primeros auxilios en situaciones de emergencia.",
            intensidadHorariaCurso = "30 horas",
            estadoCurso = true,
            fundacionId = "F001",
            ediciones = listOf("E101", "E102")
        )

        val curso2 = Curso(
            id = "curso2",
            nombreCurso = "Reanimación Cardiopulmonar (RCP) y Uso del DEA",
            descripcionCurso = "Técnicas de RCP y uso del desfibrilador externo automático (DEA).",
            intensidadHorariaCurso = "20 horas",
            estadoCurso = true,
            fundacionId = "F002",
            ediciones = listOf("E201", "E202")
        )

        val curso3 = Curso(
            id = "curso3",
            nombreCurso = "Atención de Emergencias y Traumatismos",
            descripcionCurso = "Manejo de heridas, fracturas y quemaduras en situaciones de emergencia.",
            intensidadHorariaCurso = "40 horas",
            estadoCurso = true,
            fundacionId = "F003",
            ediciones = listOf("E301", "E302")
        )
    }
}
