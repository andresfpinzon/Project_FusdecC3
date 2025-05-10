package com.example.kotlinsql.services.curso

import com.example.kotlinsql.dto.curso.CursoCreateRequest
import com.example.kotlinsql.dto.curso.CursoEdicionesRequest
import com.example.kotlinsql.dto.curso.CursoUpdateRequest
import com.example.kotlinsql.model.curso.Curso
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Service

@Service
class CursoService(private val jdbcTemplate: JdbcTemplate) {

    val rowMapperResponse = RowMapper<CursoEdicionesRequest> { rs, _ ->
        CursoEdicionesRequest(
            edicionTitulo = rs.getString("edicion_titulo")
        )
    }

    val rowMapper = RowMapper<Curso> { rs, _ ->
        Curso(
            id = rs.getInt("id"),
            nombre = rs.getString("nombre"),
            descripcion = rs.getString("descripcion"),
            intensidadHoraria = rs.getString("intensidad_horaria"),
            fundacionId = rs.getInt("fundacion_id"),
            estado = rs.getBoolean("estado")
        )
    }

    fun obtenerTodos(): List<Curso> {
        return jdbcTemplate.query("SELECT * FROM curso", rowMapper)
    }

    fun crear(request: CursoCreateRequest): Curso {
        val cursoNormalizado = request.normalizar()

        // Verificar si ya existe un curso con el mismo nombre en la misma fundación
        val existeCurso = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM curso WHERE LOWER(nombre) = LOWER(?) AND fundacion_id = ?",
            Int::class.java,
            cursoNormalizado.nombre,
            cursoNormalizado.fundacionId
        ) ?: 0

        if (existeCurso > 0) {
            throw IllegalArgumentException("Ya existe un curso con el nombre '${cursoNormalizado.nombre}' en esta fundación")
        }

        val sql = """
            INSERT INTO curso (nombre, descripcion, intensidad_horaria, fundacion_id, estado)
            VALUES (?, ?, ?, ?, true)
            RETURNING *
        """.trimIndent()

        return jdbcTemplate.queryForObject(
            sql,
            rowMapper,
            cursoNormalizado.nombre,
            cursoNormalizado.descripcion,
            cursoNormalizado.intensidadHoraria,
            cursoNormalizado.fundacionId
        ) ?: throw IllegalArgumentException("No se pudo crear el curso")
    }

    fun actualizar(id: Int, request: CursoUpdateRequest): Curso {
        if (request.isEmpty()) {
            throw IllegalArgumentException("No se proporcionaron datos para actualizar")
        }

        val cursoNormalizado = request.normalizar()

        // Verificar si el nuevo nombre ya existe en otro curso de la misma fundación
        cursoNormalizado.nombre?.let { nuevoNombre ->
            cursoNormalizado.fundacionId?.let { fundacionId ->
                val existeNombreEnOtroCurso = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM curso WHERE LOWER(nombre) = LOWER(?) AND fundacion_id = ? AND id != ?",
                    Int::class.java,
                    nuevoNombre,
                    fundacionId,
                    id
                ) ?: 0

                if (existeNombreEnOtroCurso > 0) {
                    throw IllegalArgumentException("Ya existe otro curso con el nombre '$nuevoNombre' en esta fundación")
                }
            }
        }

        val campos = mutableListOf<String>()
        val valores = mutableListOf<Any>()

        cursoNormalizado.nombre?.let { campos.add("nombre = ?"); valores.add(it) }
        cursoNormalizado.descripcion?.let { campos.add("descripcion = ?"); valores.add(it) }
        cursoNormalizado.intensidadHoraria?.let { campos.add("intensidad_horaria = ?"); valores.add(it) }
        cursoNormalizado.estado?.let { campos.add("estado = ?"); valores.add(it) }
        cursoNormalizado.fundacionId?.let { campos.add("fundacion_id = ?"); valores.add(it) }

        valores.add(id)

        val sql = """
            UPDATE curso 
            SET ${campos.joinToString(", ")} 
            WHERE id = ?
        """.trimIndent()

        val filasActualizadas = jdbcTemplate.update(sql, *valores.toTypedArray())

        if (filasActualizadas == 0) {
            throw NoSuchElementException("No se encontró el curso con ID $id para actualizar")
        }

        return jdbcTemplate.queryForObject(
            "SELECT * FROM curso WHERE id = ?",
            rowMapper,
            id
        ) ?: throw NoSuchElementException("No se pudo recuperar el curso actualizado")
    }

    fun eliminar(id: Int): Int {
        return jdbcTemplate.update("DELETE FROM curso WHERE id = ?", id)
    }

    fun obtenerEdiciones(id: Int): List<CursoEdicionesRequest> {
        val sql = "SELECT titulo as edicion_titulo FROM ediciones WHERE curso_id = ?"
        return jdbcTemplate.query(sql, rowMapperResponse, id)
    }

    fun obtenerPorId(id: Int): Curso? {
        val sql = "SELECT * FROM curso WHERE id = ?"
        return try {
            jdbcTemplate.queryForObject(sql, rowMapper, id)
        } catch (e: Exception) {
            null // Retorna null si no encuentra el curso
        }
    }

}