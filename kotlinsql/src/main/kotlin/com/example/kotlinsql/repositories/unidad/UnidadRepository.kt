package com.example.kotlinsql.repositories.unidad

import com.example.kotlinsql.model.unidad.Unidad
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.Query

@Repository
interface UnidadRespository : JpaRepository<Unidad, Long>{

    // Consulta para verificar si existe una unidad con el mismo nombre (case insensitive)
    @Query("SELECT COUNT(u) > 0 FROM Unidad u WHERE LOWER(u.nombreUnidad) = LOWER(:nombre)")
    fun existsByNombreUnidad(nombre: String): Boolean

    // Consulta para verificar si existe otra unidad con el mismo nombre pero diferente ID
    @Query("SELECT COUNT(u) > 0 FROM Unidad u WHERE LOWER(u.nombreUnidad) = LOWER(:nombre) AND u.id != :id")
    fun existsByNombreUnidadAndIdNot(nombre: String, id: Long): Boolean


}