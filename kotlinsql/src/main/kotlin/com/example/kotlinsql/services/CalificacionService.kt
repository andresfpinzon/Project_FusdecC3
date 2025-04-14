package com.example.kotlinsql.services

import com.example.kotlinsql.dto.CalificacionCreateRequest
import com.example.kotlinsql.dto.CalificacionUpdateRequest
import com.example.kotlinsql.model.Calificacion
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class CalificacionService {

    @Autowired
    lateinit var jdbcTemplate: JdbcTemplate

    val rowMapper = RowMapper { rs, _ ->
        Calificacion(
            id = rs.getInt("id"),
            titulo = rs.getString("titulo"),
            aprobado = rs.getBoolean("aprobado"),
            usuarioId = rs.getString("usuario_id"),
            estado = rs.getBoolean("estado"),
            edicion = rs.getString("edicion"),
            unidad = rs.getString("unidad"),
            createdAt = rs.getString("created_at")
        )
    }

    fun obtenerTodas(): List<Calificacion> {
        return jdbcTemplate.query("SELECT * FROM calificacion", rowMapper)
    }

    fun crear(request: CalificacionCreateRequest): Calificacion? {
        val sql = """
            INSERT INTO calificacion (titulo, aprobado, usuario_id, edicion, unidad)
            VALUES (?, ?, ?, ?, ?)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(sql, rowMapper,
            request.titulo,
            request.aprobado,
            request.usuarioId,
            request.edicion,
            request.unidad
        )
    }

    fun actualizar(id: Int, request: CalificacionUpdateRequest): Calificacion? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.titulo?.let { campos.add("titulo = ?"); valores.add(it) }
        request.aprobado?.let { campos.add("aprobado = ?"); valores.add(it) }
        request.usuarioId?.let { campos.add("usuario_id = ?"); valores.add(it) }
        request.estado?.let { campos.add("estado = ?"); valores.add(it) }
        request.edicion?.let { campos.add("edicion = ?"); valores.add(it) }
        request.unidad?.let { campos.add("unidad = ?"); valores.add(it) }

        if (campos.isEmpty()) return null

        val sql = "UPDATE calificacion SET ${campos.joinToString(", ")} WHERE id = ?"
        valores.add(id)
        jdbcTemplate.update(sql, *valores.toTypedArray())

        val sqlSelect = "SELECT * FROM calificacion WHERE id = ?"

        return jdbcTemplate.queryForObject(sqlSelect, rowMapper, id)
    }

    fun eliminar(id: Int): Int {
        return jdbcTemplate.update("DELETE FROM calificacion WHERE id = ?", id)
    }
}
