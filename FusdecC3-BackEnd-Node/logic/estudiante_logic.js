const Estudiante = require('../models/estudiante_model');

// Función para actualizar un estudiante
async function actualizarEstudiante(id, body) {
    // Buscar el estudiante por ID
    let estudiante = await Estudiante.findById(id);
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

    await estudiante.save();
    return estudiante; 
}

// Función para listar todos los estudiantes
async function listarEstudiantes() {
    return await Estudiante.find({});
}

// Función para obtener un estudiante por ID
async function obtenerEstudiantePorId(id) {
    const estudiante = await Estudiante.findById(id)
        .populate('ediciones calificaciones inasistencias asistencias certificados');
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    return estudiante;
}

// Función para asignar un colegio a un estudiante
async function asignarColegioAEstudiante(id, colegioId) {
    let estudiante = await Estudiante.findById(id);
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    estudiante.colegioId = colegioId; 
    await estudiante.save(); 
    return estudiante; 
}

// Función para asignar una unidad a un estudiante
async function asignarUnidadAEstudiante(id, unidadId) {
    let estudiante = await Estudiante.findById(id);
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    estudiante.unidadId = unidadId; 
    await estudiante.save(); 
    return estudiante; 
}

// Función para asignar ediciones a un estudiante
async function asignarEdicionesAEstudiante(id, edicionesIds) {
    let estudiante = await Estudiante.findById(id);
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    estudiante.ediciones.push(...edicionesIds); 
    await estudiante.save(); 
    return estudiante; 
}

// Función para agregar asistencia a un estudiante
async function agregarAsistenciaAEstudiante(estudianteId, asistenciaId) {
    let estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    estudiante.asistencias.push(asistenciaId); 
    await estudiante.save(); 
}

// Función para agregar inasistencia a un estudiante
async function agregarInasistenciaAEstudiante(estudianteId, inasistenciaId) {
    let estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    estudiante.inasistencias.push(inasistenciaId); 
    await estudiante.save(); 
}

// Función para agregar calificación a un estudiante
async function agregarCalificacionAEstudiante(estudianteId, calificacionId) {
    let estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    estudiante.calificaciones.push(calificacionId); 
    await estudiante.save(); 
}

// Función para agregar un certificado a un estudiante
async function agregarCertificadoAEstudiante(estudianteId, certificadoId) {
    let estudiante = await Estudiante.findById(estudianteId);
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    estudiante.certificados.push(certificadoId); 
    await estudiante.save(); 
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
    actualizarEstudiante,
    listarEstudiantes,
    obtenerEstudiantePorId,
    asignarColegioAEstudiante,
    asignarUnidadAEstudiante,
    asignarEdicionesAEstudiante,
    agregarAsistenciaAEstudiante,
    agregarInasistenciaAEstudiante,
    agregarCalificacionAEstudiante,
    agregarCertificadoAEstudiante,
    desactivarEstudiante
};

