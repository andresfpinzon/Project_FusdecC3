package com.example.kotlinsql.services

import com.example.kotlinsql.dto.ComandoResponse
import com.example.kotlinsql.dto.ComandoCreateRequest
import com.example.kotlinsql.dto.ComandoUpdateRequest
import com.example.kotlinsql.exceptions.DuplicateEntityException
import com.example.kotlinsql.exceptions.EntityNotFoundException
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ComandoService(private val jdbcTemplate: JdbcTemplate) {

    companion object {
        const val FUSDEC_NOMBRE = "FUSDEC"
    }

    private val rowMapper = RowMapper<ComandoResponse> { rs, _ ->
        val comandoId = rs.getInt("id")
        ComandoResponse(
            id = comandoId,
            nombreComando = rs.getString("nombre_comando"),
            estadoComando = rs.getBoolean("estado_comando"),
            ubicacionComando = rs.getString("ubicacion_comando"),
            fundacionNombre = FUSDEC_NOMBRE,
            brigadas = obtenerNombresBrigadasPorComandoId(comandoId),
            createdAt = rs.getString("created_at")
        )
    }

    fun obtenerTodos(): List<ComandoResponse> {
        val sql = """
            SELECT c.*
            FROM comando c
            INNER JOIN fundacion f ON c.fundacion_id = f.id
            WHERE c.estado_comando = true
            AND f.nombre = ?
            ORDER BY c.nombre_comando ASC
        """.trimIndent()

        return try {
            jdbcTemplate.query(sql, rowMapper, FUSDEC_NOMBRE)
        } catch (e: EmptyResultDataAccessException) {
            emptyList()
        }
    }

    @Transactional
    fun crear(request: ComandoCreateRequest): ComandoResponse {
        validarNombreComandoUnico(request.nombreComando)

        request.brigadasNombres?.let { brigadasNombres ->
            validarBrigadasDisponibles(brigadasNombres)
        }

        val sql = """
            INSERT INTO comando (nombre_comando, ubicacion_comando, estado_comando, fundacion_id)
            VALUES (?, ?, true, (SELECT id FROM fundacion WHERE nombre = ?))
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(sql, rowMapper,
            request.nombreComando,
            request.ubicacionComando,
            FUSDEC_NOMBRE
        )?.also { comando ->
            request.brigadasNombres?.let { brigadasNombres ->
                agregarBrigadasPorNombres(comando.id, brigadasNombres)
            }
        } ?: throw RuntimeException("Error al crear el comando")
    }

    @Transactional
    fun actualizar(id: Int, request: ComandoUpdateRequest): ComandoResponse {
        val comandoExistente = obtenerPorId(id)
            ?: throw EntityNotFoundException("No se encontró el comando con id $id")

        request.nombreComando?.let {
            if (it != comandoExistente.nombreComando) {
                validarNombreComandoUnico(it)
            }
        }

        request.brigadasNombres?.let { brigadasNombres ->
            validarBrigadasDisponibles(brigadasNombres)
        }

        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombreComando?.let { campos.add("nombre_comando = ?"); valores.add(it) }
        request.ubicacionComando?.let { campos.add("ubicacion_comando = ?"); valores.add(it) }
        request.estadoComando?.let { campos.add("estado_comando = ?"); valores.add(it) }

        if (campos.isNotEmpty()) {
            val sqlUpdate = """
                UPDATE comando
                SET ${campos.joinToString(", ")}
                WHERE id = ?
                AND estado_comando = true
                AND fundacion_id = (SELECT id FROM fundacion WHERE nombre = ?)
                RETURNING *
            """.trimIndent()

            valores.add(id)
            valores.add(FUSDEC_NOMBRE)

            jdbcTemplate.queryForObject(sqlUpdate, rowMapper, *valores.toTypedArray())
                ?: throw EntityNotFoundException("Error al actualizar el comando")
        }

        request.brigadasNombres?.let { brigadasNombres ->
            val sqlLiberarBrigadas = """
                UPDATE brigada
                SET comando_id = NULL
                WHERE comando_id = ?
            """.trimIndent()
            jdbcTemplate.update(sqlLiberarBrigadas, id)
            agregarBrigadasPorNombres(id, brigadasNombres)
        }

        return obtenerPorId(id) ?: throw EntityNotFoundException("No se encontró el comando actualizado")
    }

    private fun validarNombreComandoUnico(nombreComando: String) {
        val sql = """
            SELECT COUNT(*) FROM comando c
            INNER JOIN fundacion f ON c.fundacion_id = f.id
            WHERE c.nombre_comando = ?
            AND c.estado_comando = true
            AND f.nombre = ?
        """.trimIndent()

        val count = jdbcTemplate.queryForObject(sql, Int::class.java, nombreComando, FUSDEC_NOMBRE) ?: 0
        if (count > 0) {
            throw DuplicateEntityException("Ya existe un comando activo con el nombre: $nombreComando")
        }
    }

    private fun validarBrigadasDisponibles(brigadasNombres: List<String>) {
        val sql = """
            SELECT COUNT(*) FROM brigada b
            INNER JOIN fundacion f ON b.fundacion_id = f.id
            WHERE b.nombre_brigada = ?
            AND b.estado_brigada = true
            AND b.comando_id IS NULL
            AND f.nombre = ?
        """.trimIndent()

        brigadasNombres.forEach { nombreBrigada ->
            val count = jdbcTemplate.queryForObject(sql, Int::class.java, nombreBrigada, FUSDEC_NOMBRE) ?: 0
            if (count == 0) {
                throw EntityNotFoundException("La brigada $nombreBrigada no existe o no está disponible")
            }
        }
    }

    private fun agregarBrigadasPorNombres(comandoId: Int, brigadasNombres: List<String>) {
        val sql = """
            UPDATE brigada
            SET comando_id = ?
            WHERE nombre_brigada = ?
            AND estado_brigada = true
            AND comando_id IS NULL
            AND fundacion_id = (SELECT id FROM fundacion WHERE nombre = ?)
        """.trimIndent()

        brigadasNombres.forEach { nombreBrigada ->
            val filasAfectadas = jdbcTemplate.update(sql, comandoId, nombreBrigada, FUSDEC_NOMBRE)
            if (filasAfectadas == 0) {
                throw EntityNotFoundException("No se pudo asignar la brigada: $nombreBrigada")
            }
        }
    }

    private fun obtenerNombresBrigadasPorComandoId(comandoId: Int): List<String> {
        val sql = """
            SELECT b.nombre_brigada
            FROM brigada b
            INNER JOIN fundacion f ON b.fundacion_id = f.id
            WHERE b.comando_id = ?
            AND b.estado_brigada = true
            AND f.nombre = ?
            ORDER BY b.nombre_brigada ASC
        """.trimIndent()

        return try {
            jdbcTemplate.queryForList(sql, String::class.java, comandoId, FUSDEC_NOMBRE)
        } catch (e: EmptyResultDataAccessException) {
            emptyList()
        }
    }

    fun obtenerPorId(id: Int): ComandoResponse? {
        val sql = """
            SELECT c.*
            FROM comando c
            INNER JOIN fundacion f ON c.fundacion_id = f.id
            WHERE c.id = ?
            AND c.estado_comando = true
            AND f.nombre = ?
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id, FUSDEC_NOMBRE)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun desactivar(id: Int): ComandoResponse? {
        obtenerPorId(id) ?: throw EntityNotFoundException("No se encontró el comando con id $id")

        val sql = """
            UPDATE comando
            SET estado_comando = false
            WHERE id = ?
            AND estado_comando = true
            AND fundacion_id = (SELECT id FROM fundacion WHERE nombre = ?)
            RETURNING *
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id, FUSDEC_NOMBRE)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }
}