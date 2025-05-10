package com.example.kotlinsql.services.certificado

import com.example.kotlinsql.dto.certificado.CertificadoCreateRequest
import com.example.kotlinsql.dto.certificado.CertificadoUpdateRequest
import com.example.kotlinsql.model.certificado.Certificado
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service
import org.springframework.dao.DataAccessException
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import org.slf4j.LoggerFactory

@Service
class CertificadoService {

    private val logger = LoggerFactory.getLogger(CertificadoService::class.java)

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

    @Transactional
    fun crear(certificado: CertificadoCreateRequest): Certificado? {
        try {
            val fechaEmision = try {
                LocalDate.parse(certificado.fechaEmision)
            } catch (e: Exception) {
                throw IllegalArgumentException("Formato de fecha inválido. Debe ser YYYY-MM-DD")
            }

            val estudianteExiste = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM estudiante WHERE numero_documento = ?",
                Int::class.java,
                certificado.estudianteId
            ) ?: 0

            if (estudianteExiste == 0) {
                throw IllegalArgumentException("El estudiante no existe")
            }

            val usuarioExiste = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM usuario WHERE numero_documento = ?",
                Int::class.java,
                certificado.usuarioId
            ) ?: 0

            if (usuarioExiste == 0) {
                throw IllegalArgumentException("El usuario no existe")
            }

            val sql = """
                INSERT INTO certificado (
                    fecha_emision, 
                    usuario_id, 
                    estudiante_id, 
                    nombre_emisor, 
                    codigo_verificacion, 
                    estado
                )
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING *
            """.trimIndent()

            val certificadoCreado = jdbcTemplate.queryForObject(
                sql,
                rowMapper,
                fechaEmision,
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

        } catch (e: DataAccessException) {
            throw IllegalStateException("Error al crear el certificado: ${e.message}")
        } catch (e: Exception) {
            throw e
        }
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
