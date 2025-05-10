package com.example.kotlinsql.controllers.curso

import com.example.kotlinsql.dto.curso.CursoCreateRequest
import com.example.kotlinsql.dto.curso.CursoEdicionesRequest
import com.example.kotlinsql.dto.curso.CursoUpdateRequest
import com.example.kotlinsql.model.curso.Curso
import com.example.kotlinsql.services.curso.CursoService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.ExampleObject
import io.swagger.v3.oas.annotations.media.Schema
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import jakarta.validation.Valid
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/cursos")
class CursoController {

    @Autowired
    lateinit var cursoService: CursoService

    @Operation(summary = "Obtener todos los cursos", description = "Devuelve una lista de todos los cursos registrados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de cursos",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Curso::class))]
            )
        ]
    )
    @GetMapping
    fun obtenerTodos(): List<Curso> = cursoService.obtenerTodos()

    @Operation(summary = "Crear nuevo curso", description = "Crea un nuevo curso con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Curso creado exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Curso::class))]
            ),
            ApiResponse(
                responseCode = "400",
                description = "Datos inválidos",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Error al crear el curso")])]
            )
        ]
    )
    @PostMapping
    fun crear(@Valid @RequestBody curso: CursoCreateRequest): Curso? {
        return cursoService.crear(curso)
    }

    @Operation(summary = "Actualizar curso", description = "Actualiza un curso existente mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Curso creado exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Curso::class))]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Curso no encontrado o sin cambios",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "No se realizaron cambios o el curso no fue encontrado")])]
            )
        ]
    )
    @PutMapping("/{id}")
    fun actualizar(@PathVariable id: Int, @Valid @RequestBody curso: CursoUpdateRequest): Curso? {
        return cursoService.actualizar(id, curso)
    }

    @Operation(summary = "Eliminar curso", description = "Elimina un curso mediante su ID.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "curso eliminado exitosamente",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "curso eliminado")])]
            ),
            ApiResponse(
                responseCode = "404",
                description = "Curso no encontrado",
                content = [Content(mediaType = "text/plain", examples = [ExampleObject(value = "Curso no encontrado")])]
            )
        ]
    )
    @DeleteMapping("/{id}")
    fun eliminar(@PathVariable id: Int): String {
        val resultado = cursoService.eliminar(id)
        return if (resultado > 0) "Curso eliminado" else "Curso no encontrado"
    }

    @Operation(
        summary = "Obtener titulos de ediciones",
        description = "Devuelve los titulos de las ediciones."
    )
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Lista de ediciones",
                content = [Content(mediaType = "application/json")]
            )
        ]
    )

    @GetMapping("/{id}")
    fun obtenerPorId(@PathVariable id: Int): Curso? = cursoService.obtenerPorId(id)

    @Operation(summary = "Crear nuevo comando", description = "Crea un nuevo comando con los datos proporcionados.")
    @ApiResponses(
        value = [
            ApiResponse(
                responseCode = "200",
                description = "Comando creado exitosamente",
                content = [Content(mediaType = "application/json", schema = Schema(implementation = Curso::class))]
            )
        ]
    )

    @GetMapping("/{id}/ediciones")
    fun obtenerEdiciones(@PathVariable id: Int): List<CursoEdicionesRequest> {
        return cursoService.obtenerEdiciones(id)
    }



}