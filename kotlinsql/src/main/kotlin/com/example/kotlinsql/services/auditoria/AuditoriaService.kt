package com.example.kotlinsql.services.auditoria

import com.example.kotlinsql.model.auditoria.Auditoria
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class AuditoriaService {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    val rowMapper = RowMapper<Auditoria> { rs, _ ->
        Auditoria(
            id = rs.getInt("id"),
            fecha = rs.getString("fecha"),
            nombreEmisor = rs.getString("nombre_emisor"),
            certificadoId = rs.getInt("certificado_id"),
            estado = rs.getBoolean("estado"),
            createdAt = rs.getString("created_at")
        )
    }

    fun obtenerTodas(): List<Auditoria> {
        val sql = "SELECT * FROM auditoria"
        return jdbcTemplate.query(sql, rowMapper)
    }
}
