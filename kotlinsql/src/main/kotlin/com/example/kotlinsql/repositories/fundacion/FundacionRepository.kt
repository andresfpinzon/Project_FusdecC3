package com.example.kotlinsql.repositories.fundacion

import com.example.kotlinsql.model.edicion.Edicion
import com.example.kotlinsql.model.fundacion.Fundacion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FundacionRepository : JpaRepository<Fundacion, Long> {

    @Query("SELECT COUNT(f) > 0 FROM Fundacion f WHERE LOWER(f.nombre) = LOWER(:nombre)")
    fun existFundacionByName(nombre: String): Boolean
}