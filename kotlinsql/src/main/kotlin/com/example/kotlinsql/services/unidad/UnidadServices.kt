package com.example.kotlinsql.services.unidad

import com.example.kotlinsql.dto.unidad.CreateUnidadDto
import com.example.kotlinsql.model.unidad.Unidad

class UnidadServices {
    fun crearUnidadService(data: CreateUnidadDto): Unidad {

        val unidad = Unidad(
            nombreUnidad = data.nombreUnidad,
            brigadaId = data.brigadaId,
            usuarioId = data.usuarioId,
        )

        return unidadRepository.save(unidad)
    }
}