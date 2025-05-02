package com.example.kotlinsql.services.unidad

import com.example.kotlinsql.dto.unidad.CreateUnidadDto
import com.example.kotlinsql.model.unidad.Unidad
import com.example.kotlinsql.repositories.unidad.UnidadRespository

class UnidadServices (
    private val unidadRepository: UnidadRespository,
){
    fun crearUnidadService(data: CreateUnidadDto): Unidad {

        val unidad = Unidad(
            nombreUnidad = data.nombreUnidad,
            brigadaId = data.brigadaId,
            usuarioId = data.usuarioId,
        )

        return unidadRepository.save(unidad)
    }

    fun obtenerUnidades(): List<Unidad> {
        val unidades =  unidadRepository.findAll()
        return  unidades
    }

    fun obtenerUnidadPorId(id: Long): Unidad? {
        return unidadRepository.findById(id).orElse(null)
    }


}
