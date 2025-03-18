data class Unidad(
    private val id: String,
    private var nombreUnidad: String,
    private var brigadaId: String,
    private var estadoUnidad: Boolean,
    private var usuarioId: String,
    private var comandos: List<String>
) {
    fun getId() = id
    fun getNombreUnidad() = nombreUnidad
    fun getBrigadaId() = brigadaId
    fun getEstadoUnidad() = estadoUnidad
    fun getUsuarioId() = usuarioId
    fun getComandos() = comandos

    fun setNombreUnidad(nombre: String) {
        nombreUnidad = nombre
    }

    fun setBrigadaId(brigada: String) {
        brigadaId = brigada
    }

    fun setEstadoUnidad(estado: Boolean) {
        estadoUnidad = estado
    }

    fun setUsuarioId(usuario: String) {
        usuarioId = usuario
    }

    fun setComandos(comandos: List<String>) {
        this.comandos = comandos
    }
}