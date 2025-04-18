package com.example.kotlinsql.services

import com.example.kotlinsql.dto.CertificadoCreateRequest
import com.example.kotlinsql.dto.CertificadoUpdateRequest
import com.example.kotlinsql.model.Certificado
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class CertificadoService {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    val rowMapper = RowMapper<Certificado> { rs, _ ->
        Certificado(
            id = rs.getInt("id"),
            fechaEmision = rs.getString("fecha_emision"),
            usuarioId = rs.getString("usuario_id"),
            estudianteId = rs.getString("estudiante_id"),
            nombreEmisor = rs.getString("nombre_emisor"),
            codigoVerificacion = rs.getString("codigo_verificacion"),
            estado = rs.getBoolean("estado"),
            createdAt = rs.getString("created_at")
        )
    }

    fun obtenerTodos(): List<Certificado> {
        val sql = "SELECT * FROM certificado"
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(certificado: CertificadoCreateRequest): Certificado? {
        val sql = """
            INSERT INTO certificado (fecha_emision, usuario_id, estudiante_id, nombre_emisor, codigo_verificacion, estado)
            VALUES (?, ?, ?, ?, ?, ?)
            RETURNING *
        """.trimIndent()

        val certificadoCreado = jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            certificado.fechaEmision,
            certificado.usuarioId,
            certificado.estudianteId,
            certificado.nombreEmisor,
            certificado.codigoVerificacion,
            true
        )

        certificadoCreado?.let {
            val auditoriaSql = """
                INSERT INTO auditoria (fecha, nombre_emisor, certificado_id)
                VALUES (CURRENT_DATE, ?, ?)
            """.trimIndent()
            jdbcTemplate.update(auditoriaSql, it.nombreEmisor, it.id)
        }

        return certificadoCreado
    }

    fun actualizar(id: Int, certificado: CertificadoUpdateRequest): Certificado? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        certificado.fechaEmision?.let { campos.add("fecha_emision = ?"); valores.add(it) }
        certificado.usuarioId?.let { campos.add("usuario_id = ?"); valores.add(it) }
        certificado.estudianteId?.let { campos.add("estudiante_id = ?"); valores.add(it) }
        certificado.nombreEmisor?.let { campos.add("nombre_emisor = ?"); valores.add(it) }
        certificado.codigoVerificacion?.let { campos.add("codigo_verificacion = ?"); valores.add(it) }
        certificado.estado?.let { campos.add("estado = ?"); valores.add(it) }

        if (campos.isEmpty()) return null

        val sql = "UPDATE certificado SET ${campos.joinToString(", ")} WHERE id = ?"
        valores.add(id)
        jdbcTemplate.update(sql, *valores.toTypedArray())

        val sqlSelect = "SELECT * FROM certificado WHERE id = ?"
        return jdbcTemplate.queryForObject(sqlSelect, rowMapper, id)
    }

    fun eliminar(id: Int): Int {
        return jdbcTemplate.update("DELETE FROM certificado WHERE id = ?", id)
    }
}
