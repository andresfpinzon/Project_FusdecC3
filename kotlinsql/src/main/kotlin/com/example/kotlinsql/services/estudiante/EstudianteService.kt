package com.example.kotlinsql.services.estudiante

import com.example.kotlinsql.dto.estudiante.EstudianteCreateRequest
import com.example.kotlinsql.dto.estudiante.EstudianteUpdateRequest
import com.example.kotlinsql.model.estudiante.Estudiante
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class EstudianteService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapper = RowMapper<Estudiante> { rs, _ ->
        Estudiante(
            numeroDocumento = rs.getString("numero_documento"),
            nombre = rs.getString("nombre"),
            apellido = rs.getString("apellido"),
            tipoDocumento = rs.getString("tipo_documento"),
            genero = rs.getString("genero"),
            grado = rs.getString("grado"),
            estado = rs.getBoolean("estado"),
            asistenciasRegistradas = rs.getInt("asistencias_registradas"),
            aprobado = rs.getBoolean("aprobado"),
            unidadId = rs.getInt("unidad_id"),
            colegioId = rs.getInt("colegio_id"),
            edicionId = rs.getInt("edicion_id")

        )
    }

    fun obtenerTodos(): List<Estudiante> {
        val sql = "SELECT * FROM estudiante"
        return jdbcTemplate.query(sql, rowMapper)
    }

    fun crear(request: EstudianteCreateRequest): Estudiante {
        val estudianteNormalizado = request.normalizar()

        // Verificar si ya existe un estudiante con el mismo número de documento
        val existeDocumento = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM estudiante WHERE numero_documento = ?",
            Int::class.java,
            estudianteNormalizado.numeroDocumento
        ) ?: 0

        if (existeDocumento > 0) {
            throw IllegalArgumentException("Ya existe un estudiante con el documento '${estudianteNormalizado.numeroDocumento}'")
        }

        val sql = """
            INSERT INTO estudiante (
                numero_documento, nombre, apellido, tipo_documento,
                genero, grado, estado, unidad_id, colegio_id, edicion_id
            ) VALUES (?, ?, ?, ?, ?, ?, true, ?, ?, ?)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            estudianteNormalizado.numeroDocumento,
            estudianteNormalizado.nombre,
            estudianteNormalizado.apellido,
            estudianteNormalizado.tipoDocumento,
            estudianteNormalizado.genero,
            estudianteNormalizado.grado,
            estudianteNormalizado.unidadId,
            estudianteNormalizado.colegioId,
            estudianteNormalizado.edicionId
        ) ?: throw IllegalArgumentException("No se pudo crear el estudiante")
    }

    fun actualizar(documento: String, request: EstudianteUpdateRequest): Estudiante {
        if (request.isEmpty()) {
            throw IllegalArgumentException("No se proporcionaron datos para actualizar")
        }

        val estudianteNormalizado = request.normalizar()
        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        estudianteNormalizado.nombre?.let { campos.add("nombre = ?"); valores.add(it) }
        estudianteNormalizado.apellido?.let { campos.add("apellido = ?"); valores.add(it) }
        estudianteNormalizado.tipoDocumento?.let { campos.add("tipo_documento = ?"); valores.add(it) }
        estudianteNormalizado.genero?.let { campos.add("genero = ?"); valores.add(it) }
        estudianteNormalizado.grado?.let { campos.add("grado = ?"); valores.add(it) }
        estudianteNormalizado.estado?.let { campos.add("estado = ?"); valores.add(it) }
        estudianteNormalizado.unidadId?.let { campos.add("unidad_id = ?"); valores.add(it) }
        estudianteNormalizado.colegioId?.let { campos.add("colegio_id = ?"); valores.add(it) }
        estudianteNormalizado.edicionId?.let { campos.add("edicion_id = ?"); valores.add(it) }

        valores.add(documento)

        val sql = """
            UPDATE estudiante 
            SET ${campos.joinToString(", ")} 
            WHERE numero_documento = ?
        """.trimIndent()

        val filasActualizadas = jdbcTemplate.update(sql, *valores.toTypedArray())

        if (filasActualizadas == 0) {
            throw NoSuchElementException("No se encontró el estudiante con documento $documento para actualizar")
        }

        return jdbcTemplate.queryForObject(
            "SELECT * FROM estudiante WHERE numero_documento = ?",
            rowMapper,
            documento
        ) ?: throw NoSuchElementException("No se pudo recuperar el estudiante actualizado")
    }

    fun eliminar(documento: String): Int {
        val sql = "DELETE FROM estudiante WHERE numero_documento = ?"
        return jdbcTemplate.update(sql, documento)
    }
}
