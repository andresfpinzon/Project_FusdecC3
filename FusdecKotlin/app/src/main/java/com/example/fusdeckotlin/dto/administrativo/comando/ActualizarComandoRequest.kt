package com.example.fusdeckotlin.dto.administrativo.comando

import com.google.gson.annotations.SerializedName

data class ActualizarComandoRequest(
    @SerializedName("nombreComando")
    var nombreComando: String? = null,

    @SerializedName("estadoComadno")
    var estadoComando: Boolean ? = null,

    @SerializedName("ubicacionComando")
    var ubicacionComando: String? = null,

    @SerializedName("fundacionId")
    var fundacionId: String? = null,

)
