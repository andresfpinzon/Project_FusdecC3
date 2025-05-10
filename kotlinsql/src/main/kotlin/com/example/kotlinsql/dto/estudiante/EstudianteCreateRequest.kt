package com.example.kotlinsql.dto.estudiante

import jakarta.validation.constraints.*

data class EstudianteCreateRequest(
    @field:Pattern(regexp = "^[0-9]+\$", message = "El documento solo puede contener números")
    @field:Size(min = 5, max = 20, message = "El documento debe tener entre 5 y 20 dígitos")
    @field:NotBlank(message = "El número de documento es obligatorio")
    val numeroDocumento: String,

    @field:Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @field:NotBlank(message = "El nombre es obligatorio")
    @field:Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+\$", message = "El nombre solo puede contener letras y espacios")
    val nombre: String,

    @field:Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @field:NotBlank(message = "El apellido es obligatorio")
    @field:Pattern(regexp = "^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+\$", message = "El apellido solo puede contener letras y espacios")
    val apellido: String,

    @field:NotBlank(message = "El tipo de documento es obligatorio")
    @field:Pattern(regexp = "^(C\\.C|T\\.I|C\\.E)\$", message = "Tipo de documento no válido")
    val tipoDocumento: String,

    @field:NotBlank(message = "El género es obligatorio")
    @field:Pattern(regexp = "^(Masculino|Femenino|Otro)\$", message = "Género no válido")
    val genero: String,

    @field:NotBlank(message = "El grado es obligatorio")
    @field:Pattern(regexp = "^[8-9]°|1[0-1]°\$", message = "Grado no válido (debe ser entre 8° y 11°)")
    val grado: String,

    @field:NotNull(message = "El ID de unidad es obligatorio")
    @field:Positive(message = "El ID de unidad debe ser un número positivo")
    val unidadId: Int,

    @field:NotNull(message = "El ID de colegio es obligatorio")
    @field:Positive(message = "El ID de colegio debe ser un número positivo")
    val colegioId: Int,

    @field:NotNull(message = "El ID de edición es obligatorio")
    @field:Positive(message = "El ID de edición debe ser un número positivo")
    val edicionId: Int
) {
    fun normalizar(): EstudianteCreateRequest {
        return this.copy(
            numeroDocumento = this.numeroDocumento.trim(),
            nombre = this.nombre.lowercase().trim(),
            apellido = this.apellido.lowercase().trim(),
            tipoDocumento = this.tipoDocumento.trim().uppercase(),
            genero = this.genero.lowercase().trim(),
            grado = this.grado.lowercase().trim()
        )
    }
}