package com.example.kotlinsql.controllers

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus

@ControllerAdvice
class GlobalExceptionHandler {

    // Captura errores de validaciones del @Valid en DTO
    @ExceptionHandler(MethodArgumentNotValidException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleValidationExceptions(ex: MethodArgumentNotValidException): Map<String, Any> {
        val errores = ex.bindingResult.fieldErrors.associate {
            it.field to (it.defaultMessage ?: "Error desconocido")
        }
        return mapOf(
            "message" to "Error de validación",
            "errors" to errores
        )
    }

    @ExceptionHandler(IllegalArgumentException::class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    fun handleIllegalArgument(ex: IllegalArgumentException): Map<String, String> {
        return mapOf("message" to ex.message.orEmpty())
    }

    // Captura errores inesperados
    @ExceptionHandler(Exception::class)
    fun handleGeneralException(ex: Exception): ResponseEntity<Map<String, String>> {
        ex.printStackTrace() // Para logging
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(mapOf("message" to "Ocurrió un error inesperado"))
    }
}
