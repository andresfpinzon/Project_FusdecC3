package com.example.kotlinsql.controllers

import com.example.kotlinsql.dto.CertificadoCreateRequest
import com.example.kotlinsql.dto.CertificadoUpdateRequest
import com.example.kotlinsql.model.Certificado
import com.example.kotlinsql.services.CertificadoService
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import io.swagger.v3.oas.annotations.*
import io.swagger.v3.oas.annotations.responses.*
import io.swagger.v3.oas.annotations.media.*

@RestController
@RequestMapping("/certificados")
class CertificadoController {

    @Autowired
    lateinit var certificadoService: CertificadoService

    @Operation(summary = "Obtener todos los certificados", description = "Devuelve una lista de todos los certificados registrados.")
    @ApiResponse(
        responseCode = "200",
        description = "Lista de certificados",
        content = [Content(mediaType = "application/json", schema = Schema(implementation = Certificado::class))]
    )
    @GetMapping
    fun obtenerTodos(): List<Certificado> = certificadoService.obtenerTodos()

    @Operation(summary = "Crear nuevo certificado" , description = "Crea un nuevo certificado con los datos proporcionados.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Certificado creado exitosamente",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = Certificado::class))]
        ),
        ApiResponse(
            responseCode = "400",
            description = "Error en los datos",
            content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Error al crear el certificado")])]
        )
    )
    @PostMapping
    fun crear(@Valid @RequestBody certificado: CertificadoCreateRequest): Certificado? {
        return certificadoService.crear(certificado)
    }

    @Operation(summary = "Actualizar certificado", description = "Actualiza un certificado existente mediante su ID.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Certificado actualizado",
            content = [Content(mediaType = "application/json", schema = Schema(implementation = Certificado::class))]
        ),
        ApiResponse(
            responseCode = "404",
            description = "Certificado no encontrado",
            content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "No se realizaron cambios o el certificado no fue encontrado")])]
        )
    )
    @PutMapping("/{id}")
    fun actualizar(
        @PathVariable id: Int,
        @Valid @RequestBody certificado: CertificadoUpdateRequest
    ): Certificado? {
        return certificadoService.actualizar(id, certificado)
    }

    @Operation(summary = "Eliminar certificado" , description = "Elimina un certificado mediante su ID.")
    @ApiResponses(
        ApiResponse(
            responseCode = "200",
            description = "Certificado eliminado",
            content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Certificado eliminado")])]
        ),
        ApiResponse(
            responseCode = "404",
            description = "Certificado no encontrado",
            content = [Content(mediaType = "application/json", examples = [ExampleObject(value = "Certificado no encontrado")])]
        )
    )
    @DeleteMapping("/{id}")
    fun eliminar(@PathVariable id: Int): String {
        val resultado = certificadoService.eliminar(id)
        return if (resultado > 0) "Certificado eliminado" else "Certificado no encontrado"
    }
}
