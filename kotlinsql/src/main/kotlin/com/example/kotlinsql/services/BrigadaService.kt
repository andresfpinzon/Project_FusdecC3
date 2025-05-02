package com.example.kotlinsql.services

import com.example.kotlinsql.dto.BrigadaCreateRequest
import com.example.kotlinsql.dto.BrigadaUpdateRequest
import com.example.kotlinsql.model.Brigada
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class BrigadaService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Brigada> { rs, _ ->
        Brigada(
            id = rs.getInt("id"),
            nombreBrigada = rs.getString("nombre_brigada"),
            ubicacionBrigada = rs.getString("ubicacion_brigada"),
            estadoBrigada = rs.getBoolean("estado_brigada"),
            comandoId = rs.getString("comando_id")
        )
    }

    fun obtenerTodas(): List<Brigada> {
        return jdbcTemplate.query("SELECT * FROM brigada", rowMapper)
    }

    fun obtenerPorId(id: Int): Brigada? {
        val sql = "SELECT * FROM brigada WHERE id = ?"
        return jdbcTemplate.query(sql, rowMapper, id).firstOrNull()
    }

    fun crear(request: BrigadaCreateRequest): Brigada? {
        val sql = """
        INSERT INTO brigada (nombre_brigada, ubicacion_brigada, comando_id)
        VALUES (?, ?, ?)
        RETURNING *
        """.trimIndent()
        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            request.nombreBrigada,
            request.ubicacionBrigada,
            request.comandoId
        )
    }

    fun actualizar(id: Int, request: BrigadaUpdateRequest): Brigada? {
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombreBrigada?.let { campos.add("nombre_brigada = ?"); valores.add(it) }
        request.ubicacionBrigada?.let { campos.add("ubicacion_brigada = ?"); valores.add(it) }
        request.estadoBrigada?.let { campos.add("estado_brigada = ?"); valores.add(it) }

        if (campos.isEmpty()) return null

        val sqlUpdate = "UPDATE brigada SET ${campos.joinToString(", ")} WHERE id = ?"
        valores.add(id)
        jdbcTemplate.update(sqlUpdate, *valores.toTypedArray())

        return jdbcTemplate.queryForObject("SELECT * FROM brigada WHERE id = ?", rowMapper, id)
    }

    fun eliminar(id: Int): Int {
        return jdbcTemplate.update("DELETE FROM brigada WHERE id = ?", id)
    }

    fun obtenerUnidadesAsignadas(brigadaId: Int): List<String> {
        val sql = """
            SELECT nombre_unidad
            FROM unidad
            WHERE brigada_id = ?
            AND estado_unidad = true
            ORDER BY nombre_unidad ASC
        """.trimIndent()

        return jdbcTemplate.queryForList(sql, String::class.java, brigadaId)
    }

}
