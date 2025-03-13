import Unidad from "@models/unidad";
import Brigada from "@models/brigada";
import { CreateUnidadDto, UpdateUnidadDto } from "@dtos/unidad.dto";
import { IUnidad } from "@interfaces/unidad.interface";
import { Types } from "mongoose";

// Servicio para crear unidades
export const crearUnidadService = async (data: CreateUnidadDto) => {
    try {
        const nuevaUnidad = new Unidad(data);
        await nuevaUnidad.save();

        if (data.brigadaId) {
            await Brigada.findByIdAndUpdate(
                data.brigadaId,
                { $push: { unidades: nuevaUnidad._id } },
                { new: true }
            );
        }

        return {
            status: 201,
            message: "Unidad creada exitosamente",
            unidad: nuevaUnidad
        };
    } catch (error) {
        console.error("Error creando unidad en servicios: ", error);
        return { status: 500, message: "Error creando unidad en servicios" };
    }
};

// Servicio para listar unidades
export const listarUnidadesService = async () => {
    try {
        const unidades = await Unidad.find()
            .populate('brigadaId')
            .populate('usuarioId')
            .populate('estudiantes');

        return {
            status: 200,
            message: "Unidades recuperadas exitosamente",
            unidades: unidades
        };
    } catch (error) {
        console.error("Error listando unidades en servicios: ", error);
        return { status: 500, message: "Error listando unidades en servicios" };
    }
};

// Servicio para editar una unidad
export const editarUnidadService = async (id: string, data: UpdateUnidadDto) => {
    try {
        const unidad = await Unidad.findById(id);
        if (!unidad) {
            return { status: 404, message: `Unidad con ID ${id} no encontrada` };
        }

        unidad.nombreUnidad = data.nombreUnidad || unidad.nombreUnidad;
        unidad.estadoUnidad = data.estadoUnidad !== undefined ? data.estadoUnidad : unidad.estadoUnidad;
        unidad.brigadaId = data.brigadaId ? new Types.ObjectId(data.brigadaId) : unidad.brigadaId;
        unidad.usuarioId = data.usuarioId ? new Types.ObjectId(data.usuarioId) : unidad.usuarioId;

        await unidad.save();

        return {
            status: 200,
            message: "Unidad actualizada exitosamente",
            unidad: unidad
        };
    } catch (error) {
        console.error("Error editando unidad en servicios: ", error);
        return { status: 500, message: "Error editando unidad en servicios" };
    }
};

// Servicio para desactivar una unidad
export const desactivarUnidadService = async (id: string) => {
    try {
        const unidad = await Unidad.findByIdAndUpdate(id, { estadoUnidad: false }, { new: true });
        if (!unidad) {
            return { status: 404, message: `Unidad con ID ${id} no encontrada` };
        }
        return {
            status: 200,
            message: "Unidad desactivada exitosamente",
            unidad: unidad
        };
    } catch (error) {
        console.error("Error desactivando unidad en servicios: ", error);
        return { status: 500, message: "Error desactivando unidad en servicios" };
    }
};

// Servicio para buscar una unidad por su ID
export const buscarUnidadPorIdService = async (id: string) => {
    try {
        const unidad = await Unidad.findById(id)
            .populate('brigadaId')
            .populate('usuarioId')
            .populate('estudiantes');

        if (!unidad) {
            return { status: 404, message: "Unidad no encontrada" };
        }

        return {
            status: 200,
            message: "Unidad recuperada exitosamente",
            unidad: unidad
        };
    } catch (error) {
        console.error("Error buscando unidad por ID en servicios: ", error);
        return { status: 500, message: "Error buscando unidad por ID en servicios" };
    }
};

// Servicio para buscar unidades por brigadaId
export const buscarUnidadesPorBrigadaIdService = async (brigadaId: string) => {
    try {
        const unidades = await Unidad.find({ brigadaId })
            .populate('brigadaId')
            .populate('usuarioId')
            .populate('estudiantes');

        if (unidades.length === 0) {
            return { status: 404, message: `No se encontraron unidades para la brigada con ID ${brigadaId}` };
        }

        return {
            status: 200,
            message: "Unidades recuperadas exitosamente",
            unidades: unidades
        };
    } catch (error) {
        console.error("Error buscando unidades por brigada ID en servicios: ", error);
        return { status: 500, message: "Error buscando unidades por brigada ID en servicios" };
    }
};

// Servicio para buscar unidades por usuarioId
export const buscarUnidadesPorUsuarioIdService = async (usuarioId: string) => {
    try {
        const unidades = await Unidad.find({ usuarioId })
            .populate('brigadaId')
            .populate('usuarioId')
            .populate('estudiantes');

        if (unidades.length === 0) {
            return { status: 404, message: `No se encontraron unidades para el usuario con ID ${usuarioId}` };
        }

        return {
            status: 200,
            message: "Unidades recuperadas exitosamente",
            unidades: unidades
        };
    } catch (error) {
        console.error("Error buscando unidades por usuario ID en servicios: ", error);
        return { status: 500, message: "Error buscando unidades por usuario ID en servicios" };
    }
};