package com.example.kotlinsql.controllers.auditoria

import com.example.kotlinsql.model.auditoria.Auditoria
import com.example.kotlinsql.services.auditoria.AuditoriaService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.bind.annotation.*
import io.swagger.v3.oas.annotations.*
import io.swagger.v3.oas.annotations.responses.*
import io.swagger.v3.oas.annotations.media.*

@RestController
@RequestMapping("/auditorias")
class AuditoriaController {

    @Autowired
    lateinit var auditoriaService: AuditoriaService

    @Operation(summary = "Obtener todas las auditorías")
    @ApiResponse(
        responseCode = "200",
        description = "Lista de auditorías",
        content = [Content(mediaType = "application/json", schema = Schema(implementation = Auditoria::class))]
    )
    @GetMapping
    fun obtenerAuditorias(): List<Auditoria> = auditoriaService.obtenerTodas()
}
