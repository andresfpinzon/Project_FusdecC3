const Estudiante = require('../models/estudiante_model');
const Inasistencia = require("../models/inasistencia_model");
const Asistencia = require("../models/asistencia_model");
const Certificado = require("../models/certificado_model");
const Calificacion = require("../models/calificacion_model");

// Función para crear un nuevo estudiante
async function crearEstudiante(body) {
    // Verificar si ya existe un estudiante con el mismo correo o número de documento
    const estudianteExistente = await Estudiante.findOne({
        $or: [
            { correoEstudiante: body.correoEstudiante },
            { numeroDocumento: body.numeroDocumento }
        ]
    });

    if (estudianteExistente) {
        if (estudianteExistente.correo === body.correo) {
            throw new Error('El correo electrónico ya está registrado');
        }
        if (estudianteExistente.numeroDocumento === body.numeroDocumento) {
            throw new Error('El número de documento ya está registrado');
        }
    }

    // Crear un nuevo estudiante
    const nuevoEstudiante = new Estudiante({
        nombreEstudiante: body.nombreEstudiante,
        apellidoEstudiante: body.apellidoEstudiante,
        correoEstudiante: body.correoEstudiante,
        tipoDocumento: body.tipoDocumento,
        numeroDocumento: body.numeroDocumento,
        fechaNacimiento: body.fechaNacimiento,
        generoEstudiante: body.generoEstudiante,
        unidadId: body.unidadId,
        colegioId: body.colegioId,
        estadoEstudiante: body.estadoEstudiante,
        ediciones: body.ediciones || [],
        calificaciones: body.calificaciones || [],
        inasistencias: body.inasistencias || [],
        asistencias: body.asistencias || [],
        certificados: body.certificados || []
    });

    // Guardar el estudiante en la base de datos
    await nuevoEstudiante.save();
    return nuevoEstudiante;
}

// Función para actualizar un estudiante
async function actualizarEstudiante(id, body) {
    // Buscar el estudiante por ID
    let estudiante = await Estudiante.findById(id).populate('unidadId')
    .populate('colegioId')
    .populate('ediciones')
    .populate('calificaciones')
    .populate('inasistencias') 
    .populate('asistencias')
    .populate('certificados');
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }

    // Verificar que el correo o documento no estén en uso por otro estudiante
    const estudianteExistente = await Estudiante.findOne({
        $or: [
            { correoEstudiante: body.correoEstudiante },
            { numeroDocumento: body.numeroDocumento }
        ],
        _id: { $ne: id }
    });
    if (estudianteExistente) {
        throw new Error("El correo o número de documento ya están registrados");
    }

    estudiante.nombreEstudiante = body.nombreEstudiante || estudiante.nombreEstudiante;
    estudiante.apellidoEstudiante = body.apellidoEstudiante || estudiante.apellidoEstudiante;
    estudiante.tipoDocumento = body.tipoDocumento || estudiante.tipoDocumento;
    estudiante.numeroDocumento = body.numeroDocumento || estudiante.numeroDocumento;
    estudiante.fechaNacimiento = body.fechaNacimiento || estudiante.fechaNacimiento;
    estudiante.generoEstudiante = body.generoEstudiante || estudiante.generoEstudiante;
    estudiante.unidadId = body.unidadId || estudiante.unidadId;
    estudiante.colegioId = body.colegioId || estudiante.colegioId;
    estudiante.estadoEstudiante = body.estadoEstudiante || estudiante.estadoEstudiante;
    estudiante.ediciones = body.ediciones || estudiante.ediciones;
    await estudiante.save();
    return estudiante; 
}

// Función para listar todos los estudiantes
async function listarEstudiantes() {
    return await Estudiante.find({})
    .populate('unidadId', 'nombreUnidad')
    .populate('colegioId', 'nombreColegio')
    .populate('ediciones', 'tituloEdicion')
    .populate('calificaciones', 'tituloCalificacion')
    .populate('inasistencias', 'tituloInasistencia') 
    .populate('asistencias', 'tituloAsistencia')
    .populate('certificados', 'codigoVerificacion');
}

// Función para obtener un estudiante por ID
async function obtenerEstudiantePorId(id) {
    const estudiante = await Estudiante.findById(id)
    .populate('unidadId', 'nombreUnidad')
    .populate('colegioId', 'nombreColegio')
    .populate('ediciones', 'tituloEdicion')
    .populate('calificaciones', 'tituloCalificacion')
    .populate('inasistencias', 'tituloInasistencia') 
    .populate('asistencias', 'tituloAsistencia')
    .populate('certificados', 'codigoVerificacion');
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    return estudiante;
}

// Lógica para agregar asistencias a un estudiante
async function agregarAsistenciaAEstudiante(estudianteId, asistenciasIds) {
    try {
        const estudiante = await Estudiante.findOne({ estudianteId });
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        // Filtrar las asistencias ya existentes para no duplicarlas
        const nuevasAsistencias = asistenciasIds.filter(asistenciaId => !estudiante.asistencias.includes(asistenciaId));
        // Agregar las nuevas asistencias al array de asistencias del estudiante
        estudiante.asistencias = [...estudiante.asistencias, ...nuevasAsistencias];
        await estudiante.save();
        return estudiante;
    } catch (error) {
        throw new Error(`Error al agregar asistencias: ${error.message}`);
    }
}

// Lógica para agregar inasistencias a un estudiante
async function agregarInasistenciaAEstudiante(estudianteId, inasistenciasIds) {
    try {
        const estudiante = await Estudiante.findOne({ estudianteId });
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        // Filtrar las inasistencias ya existentes para no duplicarlas
        const nuevasInasistencias = inasistenciasIds.filter(inasistenciaId => !estudiante.inasistencias.includes(inasistenciaId));
        // Agregar las nuevas inasistencias al array de inasistencias del estudiante
        estudiante.inasistencias = [...estudiante.inasistencias, ...nuevasInasistencias];
        await estudiante.save();
        return estudiante;
    } catch (error) {
        throw new Error(`Error al agregar inasistencias: ${error.message}`);
    }
}

// Lógica para agregar certificados a un estudiante
async function agregarCertificadoAEstudiante(estudianteId, certificadosIds) {
    try {
        const estudiante = await Estudiante.findOne({ estudianteId });
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        // Filtrar los certificados ya existentes para no duplicarlos
        const nuevosCertificados = certificadosIds.filter(certificadoId => !estudiante.certificados.includes(certificadoId));
        // Agregar los nuevos certificados al array de certificados del estudiante
        estudiante.certificados = [...estudiante.certificados, ...nuevosCertificados];
        await estudiante.save();
        return estudiante;
    } catch (error) {
        throw new Error(`Error al agregar certificados: ${error.message}`);
    }
}

// Lógica para agregar calificaciones a un estudiante
async function agregarCalificacionAEstudiante(estudianteId, calificacionesIds) {
    try {
        const estudiante = await Estudiante.findOne({ estudianteId });
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        // Filtrar las calificaciones ya existentes para no duplicarlas
        const nuevasCalificaciones = calificacionesIds.filter(calificacionId => !estudiante.calificaciones.includes(calificacionId));
        // Agregar las nuevas calificaciones al array de calificaciones del estudiante
        estudiante.calificaciones = [...estudiante.calificaciones, ...nuevasCalificaciones];
        await estudiante.save();
        return estudiante;
    } catch (error) {
        throw new Error(`Error al agregar calificaciones: ${error.message}`);
    }
}

// Lógica para agregar ediciones a un estudiante
async function agregarEdicionAEstudiante(estudianteId, edicionesIds) {
    try {
        const estudiante = await Estudiante.findOne({ estudianteId });
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        // Filtrar las ediciones ya existentes para no duplicarlas
        const nuevasEdiciones = edicionesIds.filter(edicionId => !estudiante.ediciones.includes(edicionId));
        // Agregar las nuevas ediciones al array de ediciones del estudiante
        estudiante.ediciones = [...estudiante.ediciones, ...nuevasEdiciones];
        await estudiante.save();
        return estudiante;
    } catch (error) {
        throw new Error(`Error al agregar ediciones: ${error.message}`);
    }
}


// Función para desactivar un estudiante
async function desactivarEstudiante(id) {
    let estudiante = await Estudiante.findByIdAndUpdate(id, { estadoEstudiante: false }, { new: true });
    if (!estudiante) {
        throw new Error('Estudiante no encontrado');
    }
    return estudiante; 
}

module.exports = {
    crearEstudiante,
    actualizarEstudiante,
    listarEstudiantes,
    obtenerEstudiantePorId,
    agregarAsistenciaAEstudiante,
    agregarInasistenciaAEstudiante,
    agregarCertificadoAEstudiante,
    agregarCalificacionAEstudiante,
    agregarEdicionAEstudiante,
    desactivarEstudiante
};

