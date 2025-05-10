package com.example.kotlinsql.repositories.edicion

import com.example.kotlinsql.model.edicion.Edicion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface EdicionRepository : JpaRepository<Edicion, Long> {
    fun getEdicionById(id: Long): Edicion?

    @Query("SELECT COUNT(e) > 0 FROM Edicion e WHERE LOWER(e.titulo) = LOWER(:titulo)")
    fun existsByTituloIgnoreCase(titulo: String): Boolean

    @Query("SELECT COUNT(e) > 0 FROM Edicion e WHERE LOWER(e.titulo) = LOWER(:titulo) AND e.id != :id")
    fun existsByTituloIgnoreCaseAndIdNot(titulo: String, id: Long): Boolean
}