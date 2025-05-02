package com.example.kotlinsql.repositories.edicion

import com.example.kotlinsql.model.edicion.Edicion
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EdicionRepository : JpaRepository<Edicion, Long> {

}