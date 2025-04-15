package models.administrativo.user.model

import com.google.gson.annotations.SerializedName

data class Usuario(
    @SerializedName("_id")
    private val id : String? = null,
    @SerializedName("nombreUsuario")
    private var nombreUsuario: String,
    @SerializedName("apellidoUsuario")
    private var apellidoUsuario: String,
    @SerializedName("numeroDocumento")
    private var numeroDocumento: String,
    @SerializedName("correo")
    private var correo: String,
    @SerializedName("password")
    private var password: String,
    @SerializedName("roles")
    private var roles: List<String>,
    @SerializedName("estadoUsuario")
    private var estadoUsuario: Boolean,
    @SerializedName("")
    private val creadoEn: String = obtenerFechaActual()
) {

    /**++++++++++++++GETTERS+++++++++++++++++*/

    fun getUserId(): String = id.toString()

    fun getNombreUsuario(): String = nombreUsuario

    fun getApellidoUsuario(): String = apellidoUsuario

    fun getNumeroDocumento(): String = numeroDocumento

    fun getCorreo(): String = correo

    fun getPassword(): String= password

    fun getRoles(): List<String> = roles

    fun getEstadoUsuario(): Boolean = estadoUsuario

    fun getCreadoEn(): String = creadoEn

    /**++++++++++++++SETTERS+++++++++++++++++*/

    fun setNombreUsuario(nuevoNombre: String){
        nombreUsuario = nuevoNombre
    }

    fun setApellidoUsuario(nuevoApellido: String){
        apellidoUsuario = nuevoApellido
    }
    fun setNuDocumento(newDocumento: String){
        numeroDocumento = newDocumento
    }
    fun setCorreo(newCorreo: String){
        correo = newCorreo
    }
    fun setPassword(nuevaPassword: String) {
        password = nuevaPassword
    }

    fun setRoles(nuevosRoles: List<String>) {
        roles = nuevosRoles
    }

    fun setEstadoUsuario(nuevoEstado: Boolean) {
        estadoUsuario = nuevoEstado
    }



    companion object{
        val administrador = Usuario(
            nombreUsuario = "Carlos",
            apellidoUsuario = "Gómez",
            numeroDocumento = "9876543210",
            correo = "carlos.gomez@gmail.com",
            password = "password123",
            roles = listOf("Administrativo"),
            estadoUsuario = false,
            creadoEn = "2023-01-01"
        )

        val secretario = Usuario(
            nombreUsuario = "Ana",
            apellidoUsuario = "Pérez",
            numeroDocumento = "1234567890",
            correo = "ana.perez@gmail.com",
            password = "password456",
            roles = listOf("Secretario"),
            estadoUsuario = true,
            creadoEn = "2023-01-02"
        )

        val instructor = Usuario(
            nombreUsuario = "Luis",
            apellidoUsuario = "Martínez",
            numeroDocumento = "5555555555",
            correo = "luis.martinez@gmail.com",
            password = "password789",
            roles = listOf("Instructor"),
            estadoUsuario = true,
            creadoEn = "2023-01-03"
        )
        fun generateId(): String{
            return java.util.UUID.randomUUID().toString()
        }

        fun obtenerFechaActual(): String{
            val formato = java.text.SimpleDateFormat("yyyy-MM-dd")

            return formato.format(java.util.Date())
        }
    }


}
