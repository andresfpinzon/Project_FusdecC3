package models.secretario.estudiante

import java.util.Date

class Estudiante(
    val id: String,
    var nombreEstudiante: String,
    var apellidoEstudiante: String,
    var correoEstudiante: String,
    var tipoDocumento: String,
    var numeroDocumento: String,
    var fechaNacimiento: Date,
    var generoEstudiante: String,
    var unidadId: String,
    var colegioId: String,
    var estadoEstudiante: Boolean,
    var ediciones: List<String>,
    var calificaciones: List<String>,
    var asistencias: List<String>,
    var certificados: List<String>
) {
    companion object {
        val estudiante1 = Estudiante(
            id = "EST01",
            nombreEstudiante = "Juan",
            apellidoEstudiante = "Perez",
            correoEstudiante = "juan.perez@gmail.com",
            tipoDocumento = "C.C",
            numeroDocumento = "123456789",
            fechaNacimiento = Date(2002,4,24),
            generoEstudiante = "Masculino",
            unidadId = "UN1018238",
            colegioId = "C0L12381918",
            estadoEstudiante = true,
            ediciones = listOf("2025-1"),
            calificaciones = listOf("CAL18270123"),
            asistencias = listOf("ASIS12391723-91"),
            certificados = listOf("CERT1293123801")
        )

        val estudiante2 = Estudiante(
            id = "EST02",
            nombreEstudiante = "Julian",
            apellidoEstudiante = "Rivera",
            correoEstudiante = "julian.rivera@gmail.com",
            tipoDocumento = "C.C",
            numeroDocumento = "123972123",
            fechaNacimiento = Date(2005,3,30),
            generoEstudiante = "Masculino",
            unidadId = "UN1018238",
            colegioId = "C0L12381918",
            estadoEstudiante = true,
            ediciones = listOf("2025-1"),
            calificaciones = listOf("CAL18270321"),
            asistencias = listOf("ASIS12391723-19"),
            certificados = listOf("CERT1293123963")
        )

        val estudiante3 = Estudiante(
            id = "EST03",
            nombreEstudiante = "Andres",
            apellidoEstudiante = "Pinzon",
            correoEstudiante = "andres.pinzon@gmail.com",
            tipoDocumento = "C.C",
            numeroDocumento = "123972123",
            fechaNacimiento = Date(1996,4,24),
            generoEstudiante = "Masculino",
            unidadId = "UN1018238",
            colegioId = "C0L12381918",
            estadoEstudiante = true,
            ediciones = listOf("2025-1"),
            calificaciones = listOf("CAL18270723"),
            asistencias = listOf("ASIS12391723-46"),
            certificados = listOf("CERT1293123753")
        )

    }
}
