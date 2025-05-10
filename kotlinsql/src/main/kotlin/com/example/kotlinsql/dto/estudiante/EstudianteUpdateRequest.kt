package com.example.kotlinsql.dto.estudiante

import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Positive
import jakarta.validation.constraints.Size

data class EstudianteUpdateRequest(
    @field:Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @field:Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*\$", message = "El nombre solo puede contener letras y espacios")
    val nombre: String? = null,

    @field:Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @field:Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*\$", message = "El apellido solo puede contener letras y espacios")
    val apellido: String? = null,

    @field:Pattern(regexp = "^(C\\.C|T\\.I|C\\.E)?\$", message = "Tipo de documento no válido")
    val tipoDocumento: String? = null,

    @field:Pattern(regexp = "^(Masculino|Femenino|Otro)?\$", message = "Género no válido")
    val genero: String? = null,

    @field:Pattern(regexp = "^([8-9]°|1[0-1]°)?\$", message = "Grado no válido (debe ser entre 8° y 11°)")
    val grado: String? = null,

    val estado: Boolean? = null,

    @field:Positive(message = "El ID de unidad debe ser un número positivo")
    val unidadId: Int? = null,

    @field:Positive(message = "El ID de colegio debe ser un número positivo")
    val colegioId: Int? = null,

    @field:Positive(message = "El ID de edición debe ser un número positivo")
    val edicionId: Int? = null
) {
    fun normalizar(): EstudianteUpdateRequest {
        return this.copy(
            nombre = this.nombre?.lowercase()?.trim(),
            apellido = this.apellido?.lowercase()?.trim(),
            tipoDocumento = this.tipoDocumento?.trim()?.uppercase(),
            genero = this.genero?.lowercase()?.trim(),
            grado = this.grado?.lowercase()?.trim()
        )
    }

    fun isEmpty(): Boolean {
        return nombre == null &&
                apellido == null &&
                tipoDocumento == null &&
                genero == null &&
                grado == null &&
                estado == null &&
                unidadId == null &&
                colegioId == null &&
                edicionId == null
    }
}