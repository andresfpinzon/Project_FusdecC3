package com.example.kotlinsql.services

import com.example.kotlinsql.dto.BrigadaCreateRequest
import com.example.kotlinsql.dto.BrigadaResponse
import com.example.kotlinsql.dto.BrigadaUpdateRequest
import com.example.kotlinsql.exceptions.DuplicateEntityException
import com.example.kotlinsql.exceptions.EntityNotFoundException
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class BrigadaService(private val jdbcTemplate: JdbcTemplate) {

    companion object {
        const val FUSDEC_NOMBRE = "FUSDEC"
    }

    private val rowMapper = RowMapper<BrigadaResponse> { rs, _ ->
        val brigadaId = rs.getInt("id")
        BrigadaResponse(
            id = brigadaId,
            nombreBrigada = rs.getString("nombre_brigada"),
            ubicacionBrigada = rs.getString("ubicacion_brigada"),
            estadoBrigada = rs.getBoolean("estado_brigada"),
            comandoNombre = obtenerNombreComando(rs.getInt("comando_id")),
            unidades = obtenerNombresUnidadesPorBrigadaId(brigadaId),
            createdAt = rs.getString("created_at")
        )
    }

    fun obtenerTodos(): List<BrigadaResponse> {
        val sql = """
            SELECT b.*
            FROM brigada b
            INNER JOIN fundacion f ON b.fundacion_id = f.id
            WHERE b.estado_brigada = true
            AND f.nombre = ?
            ORDER BY b.nombre_brigada ASC
        """.trimIndent()

        return try {
            jdbcTemplate.query(sql, rowMapper, FUSDEC_NOMBRE)
        } catch (e: EmptyResultDataAccessException) {
            emptyList()
        }
    }

    @Transactional
    fun crear(request: BrigadaCreateRequest): BrigadaResponse {
        validarNombreBrigadaUnico(request.nombreBrigada)

        val comandoId = obtenerComandoIdPorNombre(request.comandoNombre)
            ?: throw EntityNotFoundException("No se encontró el comando: ${request.comandoNombre}")

        request.unidadesNombres?.let { unidadesNombres ->
            validarUnidadesExistentes(unidadesNombres)
        }

        val sql = """
            INSERT INTO brigada (
                nombre_brigada,
                ubicacion_brigada,
                comando_id,
                fundacion_id,
                estado_brigada
            )
            VALUES (?, ?, ?, (SELECT id FROM fundacion WHERE nombre = ?), true)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(sql, rowMapper,
            request.nombreBrigada,
            request.ubicacionBrigada,
            comandoId,
            FUSDEC_NOMBRE
        )?.also { brigada ->
            request.unidadesNombres?.let { unidadesNombres ->
                agregarUnidadesPorNombres(brigada.id, unidadesNombres)
            }
        } ?: throw RuntimeException("Error al crear la brigada")
    }

    @Transactional
    fun actualizar(id: Int, request: BrigadaUpdateRequest): BrigadaResponse {
        val brigadaExistente = obtenerPorId(id)
            ?: throw EntityNotFoundException("No se encontró la brigada con id $id")

        request.nombreBrigada?.let {
            if (it != brigadaExistente.nombreBrigada) {
                validarNombreBrigadaUnico(it)
            }
        }

        request.comandoNombre?.let {
            obtenerComandoIdPorNombre(it) ?: throw EntityNotFoundException("No se encontró el comando: $it")
        }

        request.unidadesNombres?.let { unidadesNombres ->
            validarUnidadesExistentes(unidadesNombres)
        }

        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        request.nombreBrigada?.let { campos.add("nombre_brigada = ?"); valores.add(it) }
        request.ubicacionBrigada?.let { campos.add("ubicacion_brigada = ?"); valores.add(it) }
        request.estadoBrigada?.let { campos.add("estado_brigada = ?"); valores.add(it) }
        request.comandoNombre?.let {
            val comandoId = obtenerComandoIdPorNombre(it)!!
            campos.add("comando_id = ?")
            valores.add(comandoId)
        }

        if (campos.isNotEmpty()) {
            val sqlUpdate = """
                UPDATE brigada
                SET ${campos.joinToString(", ")}
                WHERE id = ?
                AND estado_brigada = true
                AND fundacion_id = (SELECT id FROM fundacion WHERE nombre = ?)
                RETURNING *
            """.trimIndent()

            valores.add(id)
            valores.add(FUSDEC_NOMBRE)

            jdbcTemplate.queryForObject(sqlUpdate, rowMapper, *valores.toTypedArray())
                ?: throw EntityNotFoundException("Error al actualizar la brigada")
        }

        request.unidadesNombres?.let { unidadesNombres ->
            val sqlDeleteUnidades = "DELETE FROM brigada_unidad WHERE brigada_id = ?"
            jdbcTemplate.update(sqlDeleteUnidades, id)
            agregarUnidadesPorNombres(id, unidadesNombres)
        }

        return obtenerPorId(id) ?: throw EntityNotFoundException("No se encontró la brigada actualizada")
    }

    private fun validarNombreBrigadaUnico(nombreBrigada: String) {
        val sql = """
            SELECT COUNT(*) FROM brigada b
            INNER JOIN fundacion f ON b.fundacion_id = f.id
            WHERE b.nombre_brigada = ?
            AND b.estado_brigada = true
            AND f.nombre = ?
        """.trimIndent()

        val count = jdbcTemplate.queryForObject(sql, Int::class.java, nombreBrigada, FUSDEC_NOMBRE) ?: 0
        if (count > 0) {
            throw DuplicateEntityException("Ya existe una brigada activa con el nombre: $nombreBrigada")
        }
    }

    private fun validarUnidadesExistentes(unidadesNombres: List<String>) {
        val sql = """
            SELECT COUNT(*) FROM unidad
            WHERE nombre_unidad = ?
            AND estado_unidad = true
        """.trimIndent()

        unidadesNombres.forEach { nombreUnidad ->
            val count = jdbcTemplate.queryForObject(sql, Int::class.java, nombreUnidad) ?: 0
            if (count == 0) {
                throw EntityNotFoundException("La unidad $nombreUnidad no existe o no está activa")
            }
        }
    }

    private fun agregarUnidadesPorNombres(brigadaId: Int, unidadesNombres: List<String>) {
        val sql = """
            INSERT INTO brigada_unidad (brigada_id, unidad_id)
            SELECT ?, id FROM unidad
            WHERE nombre_unidad = ?
            AND estado_unidad = true
        """.trimIndent()

        unidadesNombres.forEach { nombreUnidad ->
            val filasAfectadas = jdbcTemplate.update(sql, brigadaId, nombreUnidad)
            if (filasAfectadas == 0) {
                throw EntityNotFoundException("No se pudo asignar la unidad: $nombreUnidad")
            }
        }
    }

    fun obtenerPorId(id: Int): BrigadaResponse? {
        val sql = """
            SELECT b.*
            FROM brigada b
            INNER JOIN fundacion f ON b.fundacion_id = f.id
            WHERE b.id = ?
            AND b.estado_brigada = true
            AND f.nombre = ?
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id, FUSDEC_NOMBRE)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    fun desactivar(id: Int): BrigadaResponse? {
        obtenerPorId(id) ?: throw EntityNotFoundException("No se encontró la brigada con id $id")

        val sql = """
            UPDATE brigada
            SET estado_brigada = false
            WHERE id = ?
            AND estado_brigada = true
            AND fundacion_id = (SELECT id FROM fundacion WHERE nombre = ?)
            RETURNING *
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id, FUSDEC_NOMBRE)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    private fun obtenerComandoIdPorNombre(nombreComando: String): Int? {
        val sql = """
            SELECT id FROM comando
            WHERE nombre_comando = ?
            AND estado_comando = true
            AND fundacion_id = (SELECT id FROM fundacion WHERE nombre = ?)
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, Int::class.java, nombreComando, FUSDEC_NOMBRE)
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }

    private fun obtenerNombreComando(comandoId: Int): String {
        val sql = """
            SELECT nombre_comando
            FROM comando
            WHERE id = ?
            AND estado_comando = true
        """.trimIndent()

        return try {
            jdbcTemplate.queryForObject(sql, String::class.java, comandoId) ?: "Sin comando"
        } catch (e: EmptyResultDataAccessException) {
            "Sin comando"
        }
    }

    private fun obtenerNombresUnidadesPorBrigadaId(brigadaId: Int): List<String> {
        val sql = """
            SELECT u.nombre_unidad
            FROM unidad u
            INNER JOIN brigada_unidad bu ON u.id = bu.unidad_id
            WHERE bu.brigada_id = ?
            AND u.estado_unidad = true
            ORDER BY u.nombre_unidad ASC
        """.trimIndent()

        return try {
            jdbcTemplate.queryForList(sql, String::class.java, brigadaId)
        } catch (e: EmptyResultDataAccessException) {
            emptyList()
        }
    }
}