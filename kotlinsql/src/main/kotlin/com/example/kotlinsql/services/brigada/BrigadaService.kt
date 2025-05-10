package com.example.kotlinsql.services.brigada

import com.example.kotlinsql.dto.brigada.BrigadaCreateRequest
import com.example.kotlinsql.dto.brigada.BrigadaUpdateRequest
import com.example.kotlinsql.model.brigada.Brigada
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service
import org.springframework.dao.EmptyResultDataAccessException

@Service
class BrigadaService(private val jdbcTemplate: JdbcTemplate) {

    private val rowMapper = RowMapper<Brigada> { rs, _ ->
        Brigada(
            id = rs.getInt("id"),
            nombreBrigada = rs.getString("nombre_brigada"),
            ubicacionBrigada = rs.getString("ubicacion_brigada"),
            estadoBrigada = rs.getBoolean("estado_brigada"),
            comandoId = rs.getInt("comando_id")

        )
    }

    fun obtenerTodas(): List<Brigada> {
        return jdbcTemplate.query("SELECT * FROM brigada WHERE estado_brigada = true ORDER BY nombre_brigada ASC", rowMapper)
    }

    fun obtenerPorId(id: Int): Brigada? {
        val sql = "SELECT * FROM brigada WHERE id = ? AND estado_brigada = true"
        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun crear(request: BrigadaCreateRequest): Brigada {
        val brigadaNormalizada = request.normalizar()

        // Verificar si ya existe una brigada con el mismo nombre
        val existeNombre = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM brigada WHERE LOWER(nombre_brigada) = LOWER(?)",
            Int::class.java,
            brigadaNormalizada.nombreBrigada
        ) ?: 0

        if (existeNombre > 0) {
            throw IllegalArgumentException("Ya existe una brigada con el nombre '${brigadaNormalizada.nombreBrigada}'")
        }

        val sql = """
            INSERT INTO brigada (nombre_brigada, ubicacion_brigada, comando_id)
            VALUES (?, ?, ?)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            brigadaNormalizada.nombreBrigada,
            brigadaNormalizada.ubicacionBrigada,
            brigadaNormalizada.comandoId
        ) ?: throw IllegalArgumentException("No se pudo crear la brigada")
    }

    fun actualizar(id: Int, request: BrigadaUpdateRequest): Brigada? {
        if (request.isEmpty()) {
            throw IllegalArgumentException("No se proporcionaron datos para actualizar")
        }

        val brigadaNormalizada = request.normalizar()

        // Verificar si el nuevo nombre ya existe en otra brigada
        brigadaNormalizada.nombreBrigada?.let { nuevoNombre ->
            val existeNombreEnOtraBrigada = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM brigada WHERE LOWER(nombre_brigada) = LOWER(?) AND id != ?",
                Int::class.java,
                nuevoNombre,
                id
            ) ?: 0

            if (existeNombreEnOtraBrigada > 0) {
                throw IllegalArgumentException("Ya existe otra brigada con el nombre '$nuevoNombre'")
            }
        }

        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        brigadaNormalizada.nombreBrigada?.let { campos.add("nombre_brigada = ?"); valores.add(it) }
        brigadaNormalizada.ubicacionBrigada?.let { campos.add("ubicacion_brigada = ?"); valores.add(it) }
        brigadaNormalizada.estadoBrigada?.let { campos.add("estado_brigada = ?"); valores.add(it) }
        brigadaNormalizada.comandoId?.let { campos.add("comando_id = ?"); valores.add(it) }

        valores.add(id)

        val sql = """
            UPDATE brigada 
            SET ${campos.joinToString(", ")} 
            WHERE id = ?
        """.trimIndent()

        val filasActualizadas = jdbcTemplate.update(sql, *valores.toTypedArray())

        if (filasActualizadas == 0) {
            throw NoSuchElementException("No se encontró la brigada con ID $id para actualizar")
        }

        return jdbcTemplate.queryForObject(
            "SELECT * FROM brigada WHERE id = ?",
            rowMapper,
            id
        )
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
