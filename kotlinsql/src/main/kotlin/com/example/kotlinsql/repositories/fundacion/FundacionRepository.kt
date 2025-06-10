package com.example.kotlinsql.repositories.fundacion

import com.example.kotlinsql.model.edicion.Edicion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FundacionRepository : JpaRepository<Edicion, Long> {
}