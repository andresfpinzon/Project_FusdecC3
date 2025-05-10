package com.example.kotlinsql.services.colegio

import com.example.kotlinsql.dto.colegio.ColegioCreateRequest
import com.example.kotlinsql.dto.colegio.ColegioUpdateRequest
import com.example.kotlinsql.dto.estudiante.EstudianteResumenResponse
import com.example.kotlinsql.model.colegio.Colegio
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class ColegioService(private val jdbcTemplate: JdbcTemplate) {
    val rowMapper = RowMapper<Colegio> { rs, _ ->
        Colegio(
            id = rs.getInt("id"),
            nombre = rs.getString("nombre"),
            email = rs.getString("email"),
            estado = rs.getBoolean("estado")
        )
    }

    fun obtenerTodas(): List<Colegio> {
        return jdbcTemplate.query("SELECT * FROM colegio", rowMapper)
    }

    fun crear(request: ColegioCreateRequest): Colegio {
        val colegioNormalizado = request.normalizar()

        // Verificar si ya existe un colegio con el mismo nombre o email
        val existeNombre = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM colegio WHERE LOWER(nombre) = LOWER(?)",
            Int::class.java,
            colegioNormalizado.nombre
        ) ?: 0

        if (existeNombre > 0) {
            throw IllegalArgumentException("Ya existe un colegio con el nombre '${colegioNormalizado.nombre}'")
        }

        val existeEmail = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM colegio WHERE LOWER(email) = LOWER(?)",
            Int::class.java,
            colegioNormalizado.email
        ) ?: 0

        if (existeEmail > 0) {
            throw IllegalArgumentException("Ya existe un colegio con el email '${colegioNormalizado.email}'")
        }

        val sql = """
            INSERT INTO colegio (nombre, email)
            VALUES (?, ?)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            colegioNormalizado.nombre,
            colegioNormalizado.email
        ) ?: throw IllegalArgumentException("No se pudo crear el colegio")
    }

    fun actualizar(id: Int, request: ColegioUpdateRequest): Colegio? {
        if (request.isEmpty()) {
            throw IllegalArgumentException("No se proporcionaron datos para actualizar")
        }

        val colegioNormalizado = request.normalizar()

        // Verificar si el nuevo nombre ya existe en otro colegio
        colegioNormalizado.nombre?.let { nuevoNombre ->
            val existeNombreEnOtroColegio = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM colegio WHERE LOWER(nombre) = LOWER(?) AND id != ?",
                Int::class.java,
                nuevoNombre,
                id
            ) ?: 0

            if (existeNombreEnOtroColegio > 0) {
                throw IllegalArgumentException("Ya existe otro colegio con el nombre '$nuevoNombre'")
            }
        }

        // Verificar si el nuevo email ya existe en otro colegio
        colegioNormalizado.email?.let { nuevoEmail ->
            val existeEmailEnOtroColegio = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM colegio WHERE LOWER(email) = LOWER(?) AND id != ?",
                Int::class.java,
                nuevoEmail,
                id
            ) ?: 0

            if (existeEmailEnOtroColegio > 0) {
                throw IllegalArgumentException("Ya existe otro colegio con el email '$nuevoEmail'")
            }
        }

        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        colegioNormalizado.nombre?.let { campos.add("nombre = ?"); valores.add(it) }
        colegioNormalizado.email?.let { campos.add("email = ?"); valores.add(it) }
        colegioNormalizado.estado?.let { campos.add("estado = ?"); valores.add(it) }

        valores.add(id)

        val sql = """
            UPDATE colegio 
            SET ${campos.joinToString(", ")} 
            WHERE id = ?
        """.trimIndent()

        val filasActualizadas = jdbcTemplate.update(sql, *valores.toTypedArray())

        if (filasActualizadas == 0) {
            throw NoSuchElementException("No se encontró el colegio con ID $id para actualizar")
        }

        return jdbcTemplate.queryForObject(
            "SELECT * FROM colegio WHERE id = ?",
            rowMapper,
            id
        )
    }

    fun eliminar(id: Int): Int {
        return jdbcTemplate.update("DELETE FROM colegio WHERE id = ?", id)
    }

    fun obtenerPorId(id: Int): Colegio? {
        val sql = "SELECT * FROM colegio WHERE id = ?"
        return jdbcTemplate.queryForObject(sql, rowMapper, id)
    }

    fun obtenerEstudiantesPorColegio(colegioId: Int): List<EstudianteResumenResponse> {
        val sql = """
            SELECT numero_documento, nombre, apellido 
            FROM estudiante 
            WHERE colegio_id = ? 
            AND estado = true
            ORDER BY nombre ASC
        """.trimIndent()

        return jdbcTemplate.query(sql, { rs, _ ->
            EstudianteResumenResponse(
                numeroDocumento = rs.getString("numero_documento"),
                nombre = rs.getString("nombre"),
                apellido = rs.getString("apellido")
            )
        }, colegioId)
    }
}