package com.example.kotlinsql.services.fundacion

import com.example.kotlinsql.dto.fundacion.FundacionCreateDto
import com.example.kotlinsql.model.fundacion.Fundacion
import com.example.kotlinsql.repositories.fundacion.FundacionRepository
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class FundacionService(
    private val fundacionRepository: FundacionRepository
) {

    fun createFundacion(data: FundacionCreateDto): Fundacion{
        return try {
            if (fundacionRepository.existFundacionByName(data.nombre)) {
                throw IllegalArgumentException("Ya existe una fundación con ese nombre")
            }
            val fundacion = Fundacion(
                nombre = data.nombre
            )
            fundacionRepository.save(fundacion)
        } catch (e: DataIntegrityViolationException) {
            throw IllegalArgumentException("Error al crear la Fundacion: ${e.message}")
        }
    }

}
