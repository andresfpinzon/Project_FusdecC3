package models.administrativo.colegio

class Colegio(
    val id: String,
    var nombreColegio: String,
    var emailColegio: String,
    var estadoColegio: Boolean,
    var estudiantes: List<String>
){
    companion object{
        val colegio1 = Colegio(
            id = "COL12391723-91",
            nombreColegio = "Colegio 1",
            emailColegio = "colegio@gmail.com",
            estadoColegio = true,
            estudiantes = listOf("1", "2")
        )

        val colegio2 = Colegio(
            id = "COL12391723-19",
            nombreColegio = "Colegio 2",
            emailColegio = "colegio2@gmail.com",
            estadoColegio = true,
            estudiantes = listOf("2", "3")
        )
    }
}