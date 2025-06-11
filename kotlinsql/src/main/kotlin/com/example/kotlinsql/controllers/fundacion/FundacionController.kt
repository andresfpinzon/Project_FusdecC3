package com.example.kotlinsql.controllers.fundacion

import com.example.kotlinsql.dto.fundacion.FundacionCreateDto
import com.example.kotlinsql.dto.fundacion.UpdateFundacionDto
import com.example.kotlinsql.model.fundacion.Fundacion
import com.example.kotlinsql.services.fundacion.FundacionService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.media.Schema

@RestController
@RequestMapping("/fundaciones")
class FundacionController(
    private val fundacionService: FundacionService
) {

    @Autowired

    @Operation(summary = "Get all fundaciones")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "List of fundaciones", content = [Content(schema = Schema(implementation = Fundacion::class))]),
        ApiResponse(responseCode = "500", description = "Internal server error")
    )
    @GetMapping
    fun getAllFundaciones(): List<Fundacion> {
        return fundacionService.getFundaciones()
    }

    @Operation(summary = "Create a new fundacion")
    @ApiResponses(
        ApiResponse(responseCode = "201", description = "Fundacion created successfully", content = [Content(schema = Schema(implementation = Fundacion::class))]),
        ApiResponse(responseCode = "400", description = "Bad request"),
        ApiResponse(responseCode = "500", description = "Internal server error")
    )
    @PostMapping
    fun createFundacion(@RequestBody fundacion: FundacionCreateDto): Fundacion {
        return fundacionService.createFundacion(fundacion)
    }

    @Operation(summary = "Get a fundacion by ID")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Fundacion found", content = [Content(schema = Schema(implementation = Fundacion::class))]),
        ApiResponse(responseCode = "404", description = "Fundacion not found"),
        ApiResponse(responseCode = "500", description = "Internal server error")
    )
    @GetMapping("/{id}")
    fun getFundacionById(@PathVariable id: Long): Fundacion? {
        return fundacionService.getFundacionById(id)
    }
    @Operation(summary = "Delete a fundacion by ID")
    @ApiResponses(
        ApiResponse(responseCode = "204", description = "Fundacion deleted successfully"),
        ApiResponse(responseCode = "404", description = "Fundacion not found"),
        ApiResponse(responseCode = "500", description = "Internal server error")
    )
    @DeleteMapping("/{id}")
    fun deleteFundacionById(@PathVariable id: Long): String {
        return if (fundacionService.deleteFundacionById(id)) {
            "Fundación eliminada con éxito"
        } else {
            "Fundación no encontrada"
        }
    }
    @Operation(summary = "Update a fundacion by ID")
    @ApiResponses(
        ApiResponse(responseCode = "200", description = "Fundacion updated successfully", content = [Content(schema = Schema(implementation = Fundacion::class))]),
        ApiResponse(responseCode = "400", description = "Bad request"),
        ApiResponse(responseCode = "404", description = "Fundacion not found"),
        ApiResponse(responseCode = "500", description = "Internal server error")
    )
    @PutMapping("/{id}")
    fun updateFundacion(
        @PathVariable id: Long,
        @RequestBody fundacion: UpdateFundacionDto
    ): Fundacion? {
        return fundacionService.updateFundacion(id, fundacion)

    }


}