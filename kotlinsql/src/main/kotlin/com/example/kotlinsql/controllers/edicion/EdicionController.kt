package com.example.kotlinsql.controllers.edicion

import com.example.kotlinsql.dto.estudiante.EstudianteResumenResponse
import com.example.kotlinsql.dto.edicion.CreateEdicionDto
import com.example.kotlinsql.dto.edicion.UpdateEdicionDto
import com.example.kotlinsql.model.edicion.Edicion
import com.example.kotlinsql.services.edicion.EdicionServices
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/ediciones")
class EdicionController(
    private val edicionServices: EdicionServices
) {
    @Operation(
        summary = "Obtener todas las ediciones",
        description = "Devuelve una lista de todas las ediciones registradas."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de ediciones",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Edicion::class))]
            )
        ]
    )
    @GetMapping
    fun getAllEdiciones(): List<Edicion> {
        return edicionServices.getAllEdiciones()
    }

    @Operation(summary = "Crear nueva edición", description = "Crea una nueva edición con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Edición creada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Edicion::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Datos inválidos",
                content = [Content(
                    mediaType = "text/plain",
                    examples = [ExampleObject(value = "Error al crear la edición")]
                )]
            )
        ]
    )
    @PostMapping
    fun createEdicion(@Valid @RequestBody edicion: CreateEdicionDto): Edicion {
        return edicionServices.createEdicion(edicion)
    }

    @Operation(summary = "Actualizar edición", description = "Actualiza una edición existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Edición actualizada exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Edicion::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Edición no encontrada",
                content = [Content(
                    mediaType = "text/plain",
                    examples = [ExampleObject(value = "Error al actualizar la edición")]
                )]
            )
        ]
    )
    @PutMapping("/{id}")
    fun updateEdicion(@PathVariable id: Long, @Valid @RequestBody edicion: UpdateEdicionDto): Edicion? {
        return edicionServices.updateEdicion(id, edicion)
    }

    @Operation(summary = "Eliminar edición", description = "Elimina una edición existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode
                = "200",
                description = "Edición eliminada exitosamente",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Edición eliminada")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Edición no encontrada",
                content = [Content(
                    mediaType = "text/plain",
                    examples = [ExampleObject(value = "Error al eliminar la edición")]
                )]
            )
        ]
    )
    @DeleteMapping("/{id}")
    fun deleteEdicion(@PathVariable id: Long): String {
        edicionServices.deleteEdicion(id)
        return "Edición eliminada"
    }

    @Operation(summary = "Obtener edición por ID", description = "Devuelve una edición específica mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Edición encontrada",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Edicion::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Edición no encontrada",
                content = [Content(
                    mediaType = "text/plain",
                    examples = [ExampleObject(value = "Edición no encontrada")]
                )]
            )
        ]
    )
    @GetMapping("/{id}")
    fun getEdicionById(@PathVariable id: Long): Edicion? {
        return edicionServices.getEdicionById(id)
    }

    @Operation(summary = "Obtener estudiantes por edición",
        description = "Devuelve una lista de estudiantes (documento, nombre, apellido) para una edición específica")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de estudiantes",
                content = [Content(mediaType = "application/json",
                    schema = Schema(implementation = EstudianteResumenResponse::class))])
        ]
    )
    @GetMapping("/{id}/estudiantes")
    fun obtenerEstudiantesPorEdicion(@PathVariable id: Int): List<EstudianteResumenResponse> {
        return edicionServices.obtenerEstudiantesPorEdicion(id)
    }


}
