package models.administrativo.user.model

data class Usuario(
    private val id : String = generateId(),
    private var nombreUsuario: String,
    private var apellidoUsuario: String,
    private val numeroDocumento: String,
    private val correo: String,
    private var password: String,
    private var roles: List<String>,
    private var estadoUsuario: Boolean,
    private val creadoEn: String = obtenerFechaActual()
) {

    /**++++++++++++++GETTERS+++++++++++++++++*/
    fun getUserId(): String{
        return id
    }
    fun getNombreUsuario(): String{
        return nombreUsuario
    }
    fun getApellidoUsuario(): String{
        return apellidoUsuario
    }
    fun getNumeroDocumento(): String{
        return numeroDocumento
    }
    fun getCorreo(): String{
        return correo
    }
    fun getPassword(): String{
        return password
    }
    fun getRoles(): List<String>{
        return roles
    }
    fun getEstadoUsuario(): Boolean{
        return estadoUsuario
    }
    fun getCreadoEn(): String{
        return creadoEn
    }
    /**++++++++++++++SETTERS+++++++++++++++++*/

    fun setNombreUsuario(nuevoNombre: String){
        nombreUsuario = nuevoNombre
    }

    fun setApellidoUsuario(nuevoApellido: String){
        apellidoUsuario = nuevoApellido
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
            id = "SAJDFKLAJDO1-1",
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
            id = "NCXVNCZKVDKFA-2",
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
            id = "YWEIRWEEYIRWH-3",
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
