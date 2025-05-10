package com.example.kotlinsql.services.fundacion

import com.example.kotlinsql.model.fundacion.Fundacion
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class FundacionService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Fundacion> { rs, _ ->
        Fundacion(
            id = rs.getInt("id"),
            nombre = rs.getString("nombre"),
            estado = rs.getBoolean("estado"),
        )
    }

    fun obtenerTodas(): List<Fundacion> {
        return jdbcTemplate.query("SELECT * FROM  fundacion", rowMapper)
    }

    fun obtenerPorId(id: Int): Fundacion? {
        val sql = "SELECT * FROM fundacion WHERE id = ?"
        return jdbcTemplate.queryForObject(sql, rowMapper, id)
    }

}
