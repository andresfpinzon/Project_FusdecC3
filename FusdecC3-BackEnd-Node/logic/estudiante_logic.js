const Estudiante = require('../models/estudiante_model');
const Inasistencia = require("../models/inasistencia_model");
const Asistencia = require("../models/asistencia_model");
const Certificado = require("../models/certificado_model");
const Calificacion = require("../models/calificacion_model");
const Colegio = require("../models/colegio_model");
const Unidad = require('../models/unidad_model');
const Edicion = require('../models/edicion_model');

// Función para crear un nuevo estudiante
async function crearEstudiante(body) {
    try {
     
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
        asistencias: body.asistencias || [],
        certificados: body.certificados || []
    });

    // Guardar el estudiante en la base de datos
    await nuevoEstudiante.save();

    // Actualizar Unidad con el nuevo estudiante
    if (body.unidadId) {
        await Unidad.findByIdAndUpdate(
            body.unidadId,
            { $push: { estudiantes: nuevoEstudiante._id } },
            { new: true } // Retorna el documento actualizado
        );
    }

    // Actualizar Colegio con el nuevo estudiante
    if (body.colegioId) {
        await Colegio.findByIdAndUpdate(
            body.colegioId,
            { $push: { estudiantes: nuevoEstudiante._id } },
            { new: true }
        );
    }

    // Actualizar Ediciones con el nuevo estudiante
    if (body.ediciones && body.ediciones.length > 0) {
        await Edicion.updateMany(
            { _id: { $in: body.ediciones } },
            { $push: { estudiantes: nuevoEstudiante._id } }
        );
    }

    return nuevoEstudiante;   
    } catch (error) {
        console.error('Error al crear el estudiante (estudiante_logic):', error);
        throw error;
    }
}

async function actualizarEstudiante(id, body) {
    try {
        
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

    // Guardar las referencias originales
    const unidadOriginalId = estudiante.unidadId;
    const colegioOriginalId = estudiante.colegioId;
    const edicionesOriginales = estudiante.ediciones || [];

    // Actualizar los campos del estudiante
    estudiante.nombreEstudiante = body.nombreEstudiante || estudiante.nombreEstudiante;
    estudiante.apellidoEstudiante = body.apellidoEstudiante || estudiante.apellidoEstudiante;
    estudiante.tipoDocumento = body.tipoDocumento || estudiante.tipoDocumento;
    estudiante.numeroDocumento = body.numeroDocumento || estudiante.numeroDocumento;
    estudiante.fechaNacimiento = body.fechaNacimiento || estudiante.fechaNacimiento;
    estudiante.generoEstudiante = body.generoEstudiante || estudiante.generoEstudiante;
    estudiante.unidadId = body.unidadId || estudiante.unidadId;
    estudiante.colegioId = body.colegioId || estudiante.colegioId;
    estudiante.ediciones = body.ediciones || estudiante.ediciones;

    // Guardar los cambios en el estudiante
    estudiante = await estudiante.save();

    // Actualizar relaciones: Unidad
    if (unidadOriginalId && unidadOriginalId.toString() !== body.unidadId) {
        // Eliminar el estudiante de la unidad anterior
        await Unidad.findByIdAndUpdate(
            unidadOriginalId,
            { $pull: { estudiantes: estudiante._id } }
        );
    }
    if (body.unidadId && unidadOriginalId !== body.unidadId) {
        // Agregar el estudiante a la nueva unidad
        await Unidad.findByIdAndUpdate(
            body.unidadId,
            { $push: { estudiantes: estudiante._id } }
        );
    }

    // Actualizar relaciones: Colegio
    if (colegioOriginalId && colegioOriginalId.toString() !== body.colegioId) {
        // Eliminar el estudiante del colegio anterior
        await Colegio.findByIdAndUpdate(
            colegioOriginalId,
            { $pull: { estudiantes: estudiante._id } }
        );
    }
    if (body.colegioId && colegioOriginalId !== body.colegioId) {
        // Agregar el estudiante al nuevo colegio
        await Colegio.findByIdAndUpdate(
            body.colegioId,
            { $push: { estudiantes: estudiante._id } }
        );
    }

    // Actualizar relaciones: Ediciones
    const edicionesNuevas = body.ediciones || [];
    const edicionesAEliminar = edicionesOriginales.filter(id => !edicionesNuevas.includes(id.toString()));
    const edicionesAAgregar = edicionesNuevas.filter(id => !edicionesOriginales.includes(id.toString()));

    // Eliminar el estudiante de las ediciones que ya no están asociadas
    if (edicionesAEliminar.length > 0) {
        await Edicion.updateMany(
            { _id: { $in: edicionesAEliminar } },
            { $pull: { estudiantes: estudiante._id } }
        );
    }

    // Agregar el estudiante a las nuevas ediciones
    if (edicionesAAgregar.length > 0) {
        await Edicion.updateMany(
            { _id: { $in: edicionesAAgregar } },
            { $push: { estudiantes: estudiante._id } }
        );
    }

    return estudiante;
    } catch (error) {
        console.error('Error al actualizar el estudiante (estudiante_logic):', error);
        throw error;
    }
}


// Función para listar todos los estudiantes
async function listarEstudiantes() {
    try {
        
    return await Estudiante.find({})
    .populate('unidadId')
    .populate('colegioId')
    .populate('ediciones')
    .populate('calificaciones')
    .populate('asistencias',)
    .populate('certificados');
    } catch (error) {
        console.error('Error al listar los estudiantes (estudiante_logic):', error);
        throw error;
    }
}

// Función para obtener un estudiante por ID
async function obtenerEstudiantePorId(id) {
    try {
        
    const estudiante = await Estudiante.findById(id)
    .populate('unidadId')
    .populate('colegioId')
    .populate('ediciones')
    .populate('calificaciones')
    .populate('asistencias')
    .populate('certificados');
    if (!estudiante) {
        throw new Error("Estudiante no encontrado");
    }
    return estudiante;
    } catch (error) {
            console.error('Error al obtener el estudiante (estudiante_logic):', error);
            throw error;
    }
}

// Lógica para agregar asistencias a un estudiante
async function agregarAsistenciaAEstudiante(estudianteId, asistenciasIds) {
    try {
        const estudiante = await Estudiante.findById(estudianteId);
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        // Convertir los IDs a strings para comparación
        const asistenciasActuales = estudiante.asistencias.map(id => id.toString());
        // Filtrar las asistencias ya existentes para no duplicarlas
        const nuevasAsistencias = asistenciasIds.filter(id => !asistenciasActuales.includes(id.toString()));
        // Agregar las nuevas asistencias al array de asistencias del estudiante
        estudiante.asistencias.push(...nuevasAsistencias);
        const estudianteActualizado = await estudiante.save();
        return estudianteActualizado;
    } catch (error) {
        throw new Error(`Error al agregar asistencias: ${error.message}`);
    }
}

// Lógica para agregar certificados a un estudiante
async function agregarCertificadoAEstudiante(estudianteId, certificadosIds) {
    try {
        const estudiante = await Estudiante.findById(estudianteId);
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        // Convertir los IDs a strings para comparación
        const certificadosActuales = estudiante.certificados.map(id => id.toString());
        // Filtrar los certificados ya existentes para no duplicarlos
        const nuevosCertificados = certificadosIds.filter(id => !certificadosActuales.includes(id.toString()));
        // Agregar los nuevos certificados al array de certificados del estudiante
        estudiante.certificados.push(...nuevosCertificados);
        const estudianteActualizado = await estudiante.save();
        return estudianteActualizado;
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
    try {
        let estudiante = await Estudiante.findByIdAndUpdate(id, { estadoEstudiante: false }, { new: true });
    if (!estudiante) {
        throw new Error('Estudiante no encontrado');
    }
    return estudiante; 
    } catch (error) {
        console.error('Error al desactivar el estudiante (estudiante_logic):', error);
    }
    
}

module.exports = {
    crearEstudiante,
    actualizarEstudiante,
    listarEstudiantes,
    obtenerEstudiantePorId,
    agregarAsistenciaAEstudiante,
    agregarCertificadoAEstudiante,
    agregarCalificacionAEstudiante,
    agregarEdicionAEstudiante,
    desactivarEstudiante
};