package com.example.kotlinsql.services.comando

import com.example.kotlinsql.dto.comando.ComandoCreateRequest
import com.example.kotlinsql.dto.comando.ComandoUpdateRequest
import com.example.kotlinsql.model.comando.Comando
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class ComandoService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Comando> { rs, _ ->
        Comando(
            id = rs.getInt("id"),
            nombreComando = rs.getString("nombre_comando"),
            ubicacionComando = rs.getString("ubicacion_comando"),
            estadoComando = rs.getBoolean("estado_comando"),
            fundacionId = rs.getInt("fundacion_id")
        )
    }

    fun obtenerTodos(): List<Comando> {
        return jdbcTemplate.query("SELECT * FROM comando", rowMapper)
    }

    fun obtenerPorId(id: Int): Comando? {
        val sql = "SELECT * FROM comando WHERE id = ?"
        return jdbcTemplate.query(sql, rowMapper, id).firstOrNull()
    }

    fun crear(request: ComandoCreateRequest): Comando {
        val comandoNormalizado = request.normalizar()

        // Verificar si ya existe un comando con el mismo nombre
        val existeNombre = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM comando WHERE LOWER(nombre_comando) = LOWER(?)",
            Int::class.java,
            comandoNormalizado.nombreComando
        ) ?: 0

        if (existeNombre > 0) {
            throw IllegalArgumentException("Ya existe un comando con el nombre '${comandoNormalizado.nombreComando}'")
        }

        val sql = """
            INSERT INTO comando (nombre_comando, ubicacion_comando, fundacion_id)
            VALUES (?, ?, ?)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            comandoNormalizado.nombreComando,
            comandoNormalizado.ubicacionComando,
            comandoNormalizado.fundacionId
        ) ?: throw IllegalArgumentException("No se pudo crear el comando")
    }

    fun actualizar(id: Int, request: ComandoUpdateRequest): Comando? {
        if (request.isEmpty()) {
            throw IllegalArgumentException("No se proporcionaron datos para actualizar")
        }

        val comandoNormalizado = request.normalizar()

        // Verificar si el nuevo nombre ya existe en otro comando
        comandoNormalizado.nombreComando?.let { nuevoNombre ->
            val existeNombreEnOtroComando = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM comando WHERE LOWER(nombre_comando) = LOWER(?) AND id != ?",
                Int::class.java,
                nuevoNombre,
                id
            ) ?: 0

            if (existeNombreEnOtroComando > 0) {
                throw IllegalArgumentException("Ya existe otro comando con el nombre '$nuevoNombre'")
            }
        }

        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        comandoNormalizado.nombreComando?.let { campos.add("nombre_comando = ?"); valores.add(it) }
        comandoNormalizado.ubicacionComando?.let { campos.add("ubicacion_comando = ?"); valores.add(it) }
        comandoNormalizado.estadoComando?.let { campos.add("estado_comando = ?"); valores.add(it) }
        comandoNormalizado.fundacionId?.let { campos.add("fundacion_id = ?"); valores.add(it) }

        valores.add(id)

        val sql = """
            UPDATE comando 
            SET ${campos.joinToString(", ")} 
            WHERE id = ?
        """.trimIndent()

        val filasActualizadas = jdbcTemplate.update(sql, *valores.toTypedArray())

        if (filasActualizadas == 0) {
            throw NoSuchElementException("No se encontró el comando con ID $id para actualizar")
        }

        return jdbcTemplate.queryForObject(
            "SELECT * FROM comando WHERE id = ?",
            rowMapper,
            id
        )
    }


    fun eliminar(id: Int): Int {
        return jdbcTemplate.update("DELETE FROM comando WHERE id = ?", id)
    }

    fun obtenerBrigadasAsignadas(comandoId: Int): List<String> {
        val sql = """
            SELECT nombre_brigada
            FROM brigada
            WHERE comando_id = ?
            AND estado_brigada = true
            ORDER BY nombre_brigada ASC
        """.trimIndent()

        return jdbcTemplate.queryForList(sql, String::class.java, comandoId)
    }

}