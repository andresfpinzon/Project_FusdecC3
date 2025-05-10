package com.example.kotlinsql.dto.usuario

import jakarta.validation.constraints.*

data class UsuarioCreateRequest(
    @field:Pattern(regexp = "^[0-9]+\$", message = "El documento solo puede contener números")
    @field:Size(min = 5, max = 20, message = "El documento debe tener entre 5 y 20 dígitos")
    @field:NotBlank(message = "El número de documento es obligatorio")
    val numeroDocumento: String,

    @field:Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres")
    @field:NotBlank(message = "El nombre es obligatorio")
    @field:Pattern(regexp = "^[\\p{L} ]+\$", message = "El nombre solo puede contener letras y espacios")
    val nombre: String,

    @field:Size(min = 2, max = 50, message = "El apellido debe tener entre 2 y 50 caracteres")
    @field:NotBlank(message = "El apellido es obligatorio")
    @field:Pattern(regexp = "^[\\p{L} ]+\$", message = "El apellido solo puede contener letras y espacios")
    val apellido: String,

    @field:Email(message = "El correo electrónico debe ser válido")
    @field:Size(max = 100, message = "El correo electrónico no puede exceder los 100 caracteres")
    @field:NotBlank(message = "El correo es obligatorio")
    val correo: String,

    @field:Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    @field:NotBlank(message = "La contraseña es obligatoria")
    val password: String
) {
    fun normalizar(): UsuarioCreateRequest {
        return this.copy(
            nombre = this.nombre.lowercase().trim(),
            apellido = this.apellido.lowercase().trim(),
            correo = this.correo.lowercase().trim(),
            numeroDocumento = this.numeroDocumento.trim()
        )
    }
}
