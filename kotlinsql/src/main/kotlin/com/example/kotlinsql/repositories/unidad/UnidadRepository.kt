package com.example.kotlinsql.repositories.unidad

import com.example.kotlinsql.model.unidad.Unidad
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UnidadRespository : JpaRepository<Unidad, Long>{

    // Métodos personalizados van acá


}