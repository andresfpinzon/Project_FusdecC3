import Brigada from "@models/brigada";
import Comando from "@models/comando";
import { CreateBrigadaDto, UpdateBrigadaDto } from "@dtos/brigada.dto";
import { IBrigada } from "@interfaces/brigada.interface";
import { Types } from "mongoose";

// Servicio para crear brigadas
export const crearBrigadaService = async (data: CreateBrigadaDto) => {
    try {
        const brigadaExistente = await Brigada.findOne({ nombreBrigada: data.nombreBrigada });

        if (brigadaExistente) {
            return { status: 400, message: `Ya existe una brigada con el nombre "${data.nombreBrigada}" para el comando con ID ${data.comandoId}` };
        }

        const brigada = new Brigada({
            nombreBrigada: data.nombreBrigada,
            ubicacionBrigada: data.ubicacionBrigada,
            estadoBrigada: data.estadoBrigada,
            comandoId: data.comandoId,
            unidades: data.unidades || []
        });

        const nuevaBrigada = await brigada.save();

        await Comando.findByIdAndUpdate(data.comandoId, { $push: { brigadas: nuevaBrigada._id } });

        return {
            status: 201,
            message: "Brigada creada exitosamente",
            brigada: nuevaBrigada
        };
    } catch (error) {
        console.error("Error creando brigada en servicios: ", error);
        return { status: 500, message: "Error creando brigada en servicios" };
    }
};

// Servicio para listar brigadas activas
export const listarBrigadasService = async () => {
    try {
        const brigadas = await Brigada.find({ estadoBrigada: true })
            .populate('unidades')
            .populate('comandoId');

        return {
            status: 200,
            message: "Brigadas recuperadas exitosamente",
            brigadas: brigadas
        };
    } catch (error) {
        console.error("Error listando brigadas en servicios: ", error);
        return { status: 500, message: "Error listando brigadas en servicios" };
    }
};

// Servicio para buscar una brigada por su ID
export const buscarBrigadaPorIdService = async (id: string) => {
    try {
        const brigada = await Brigada.findById(id)
            .populate('comandoId')
            .populate('unidades');

        if (!brigada) return { status: 404, message: "Brigada no encontrada" };

        return {
            status: 200,
            message: "Brigada recuperada exitosamente",
            brigada: brigada
        };
    } catch (error) {
        console.error("Error buscando brigada por ID en servicios: ", error);
        return { status: 500, message: "Error buscando brigada por ID en servicios" };
    }
};

// Servicio para editar una brigada
export const editarBrigadaService = async (id: string, data: UpdateBrigadaDto) => {
    try {
        const brigada = await Brigada.findById(id);
        if (!brigada) {
            return { status: 404, message: `Brigada con ID ${id} no encontrada` };
        }

        brigada.nombreBrigada = data.nombreBrigada || brigada.nombreBrigada;
        brigada.ubicacionBrigada = data.ubicacionBrigada || brigada.ubicacionBrigada;
        brigada.estadoBrigada = data.estadoBrigada !== undefined ? data.estadoBrigada : brigada.estadoBrigada;
        brigada.comandoId = data.comandoId ? new Types.ObjectId(data.comandoId) : brigada.comandoId;
        brigada.unidades = data.unidades ? data.unidades.map(id => new Types.ObjectId(id)) : brigada.unidades;

        const brigadaActualizada = await brigada.save();

        return {
            status: 200,
            message: "Brigada actualizada exitosamente",
            brigada: brigadaActualizada
        };
    } catch (error) {
        console.error("Error editando brigada en servicios: ", error);
        return { status: 500, message: "Error editando brigada en servicios" };
    }
};

// Servicio para desactivar una brigada
export const desactivarBrigadaService = async (id: string) => {
    try {
        const brigada = await Brigada.findByIdAndUpdate(id, { estadoBrigada: false }, { new: true });
        if (!brigada) {
            return { status: 404, message: `Brigada con ID ${id} no encontrada` };
        }
        return {
            status: 200,
            message: "Brigada desactivada exitosamente",
            brigada: brigada
        };
    } catch (error) {
        console.error("Error desactivando brigada en servicios: ", error);
        return { status: 500, message: "Error desactivando brigada en servicios" };
    }
};

// Servicio para buscar brigadas por comandoId
export const buscarBrigadasPorComandoIdService = async (comandoId: string) => {
    try {
        const brigadas = await Brigada.find({ comandoId }).populate('comandoId').populate('unidades');
        if (brigadas.length === 0) {
            return { status: 404, message: `No se encontraron brigadas para el comando con ID ${comandoId}` };
        }
        return {
            status: 200,
            message: "Brigadas recuperadas exitosamente",
            brigadas: brigadas
        };
    } catch (error) {
        console.error("Error buscando brigadas por comando ID en servicios: ", error);
        return { status: 500, message: "Error buscando brigadas por comando ID en servicios" };
    }
};

// Servicio para buscar brigadas por unidad
export const buscarBrigadasPorUnidadIdService = async (unidadId: string) => {
    try {
        const brigadas = await Brigada.find({ unidades: unidadId }).populate('comandoId').populate('unidades');
        if (brigadas.length === 0) {
            return { status: 404, message: `No se encontraron brigadas para la unidad con ID ${unidadId}` };
        }
        return {
            status: 200,
            message: "Brigadas recuperadas exitosamente",
            brigadas: brigadas
        };
    } catch (error) {
        console.error("Error buscando brigadas por unidad ID en servicios: ", error);
        return { status: 500, message: "Error buscando brigadas por unidad ID en servicios" };
    }
};

// Servicio para agregar unidades a una brigada
export const agregarUnidadesAbrigadaService = async (brigadaId: string, unidadIds: string[]) => {
    try {
        const brigada = await Brigada.findById(brigadaId);
        if (!brigada) {
            return { status: 404, message: 'Brigada no encontrada' };
        }
        const nuevasUnidades = unidadIds
            .filter(unidadId => !brigada.unidades.includes(new Types.ObjectId(unidadId)))
            .map(id => new Types.ObjectId(id));
        brigada.unidades = [...brigada.unidades, ...nuevasUnidades];
        await brigada.save();
        return {
            status: 200,
            message: "Unidades agregadas a la brigada exitosamente",
            brigada: brigada
        };
    } catch (error) {
        console.error("Error agregando unidades a la brigada en servicios: ", error);
        return { status: 500, message: "Error agregando unidades a la brigada en servicios" };
    }
};