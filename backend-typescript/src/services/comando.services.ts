import Comando from "@models/comando";
import { CreateComandoDto, UpdateComandoDto } from "@dtos/comando.dto";
import { Types } from "mongoose";

// Servicio para listar comandos
export const listarComandosServices = async () => {
    try {
        const comandos = await Comando.find().populate('fundacionId').populate('brigadas').exec();
        return {
            status: 200,
            message: "Comandos retrieved successfully",
            comandos: comandos
        };
    } catch (error) {
        console.error("Error listing comandos in services: ", error);
        return { status: 500, message: "Error listing comandos in services" };
    }
};

// Servicio para crear un comando
export const crearComandoServices = async (data: CreateComandoDto) => {
    try {
        const comando = new Comando(data);
        const savedComando = await comando.save();
        return {
            status: 201,
            message: "Comando created successfully",
            comando: savedComando
        };
    } catch (error) {
        console.error("Error creating comando in services: ", error);
        return { status: 500, message: "Error creating comando in services" };
    }
};

// Servicio para actualizar un comando
export const actualizarComandoServices = async (id: string, data: UpdateComandoDto) => {
    try {
        const comando = await Comando.findByIdAndUpdate(id, data, { new: true }).exec();
        if (!comando) return { status: 404, message: "Comando not found" };
        
        return {
            status: 200,
            message: "Comando updated successfully",
            comando: comando
        };
    } catch (error) {
        console.error("Error updating comando in services: ", error);
        return { status: 500, message: "Error updating comando in services" };
    }
};

// Servicio para desactivar un comando
export const desactivarComandoServices = async (id: string) => {
    try {
        const comando = await Comando.findByIdAndUpdate(id, { estadoComando: false }, { new: true }).exec();
        if (!comando) return { status: 404, message: "Comando not found" };
        
        return {
            status: 200,
            message: "Comando deactivated successfully",
            comando: comando
        };
    } catch (error) {
        console.error("Error deactivating comando in services: ", error);
        return { status: 500, message: "Error deactivating comando in services" };
    }
};

// Servicio para buscar un comando por su ID
export const buscarComandoPorIdServices = async (id: string) => {
    try {
        const comando = await Comando.findById(id).populate('fundacionId').populate('brigadas').exec();
        if (!comando) return { status: 404, message: "Comando not found" };
        
        return {
            status: 200,
            message: "Comando retrieved successfully",
            comando: comando
        };
    } catch (error) {
        console.error("Error retrieving comando by id in services: ", error);
        return { status: 500, message: "Error retrieving comando by id in services" };
    }
};

// Servicio para agregar brigadas a un comando
export const agregarBrigadasAComandosServices = async (id: string, brigadaIds: string[]) => {
    try {
        const comando = await Comando.findById(id).exec();
        if (!comando) return { status: 404, message: "Comando not found" };
        
        // Convertir brigadaIds a ObjectId
        const objectIdBrigadaIds = brigadaIds.map(id => new Types.ObjectId(id));
        comando.brigadas.push(...objectIdBrigadaIds);
        
        const updatedComando = await comando.save();
        
        return {
            status: 200,
            message: "Brigadas added to comando successfully",
            comando: updatedComando
        };
    } catch (error) {
        console.error("Error adding brigadas to comando in services: ", error);
        return { status: 500, message: "Error adding brigadas to comando in services" };
    }
};