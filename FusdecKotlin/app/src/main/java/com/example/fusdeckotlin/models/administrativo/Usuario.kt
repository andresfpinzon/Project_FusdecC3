package models.administrativo

class Usuario(
    val nombreUsuario: String,
    val apellidoUsuario: String,
    val numeroDocumento: String,
    val correo: String,
    val password: String,
    val roles: List<String>,
    val estadoUsuario: Boolean,
    val creadoEn: String
) {
    companion object {
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
    }
}