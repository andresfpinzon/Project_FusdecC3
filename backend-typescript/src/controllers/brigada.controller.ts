import { Request, Response } from "express";
import {
    listarBrigadasService,
    crearBrigadaService,
    editarBrigadaService,
    desactivarBrigadaService,
    buscarBrigadaPorIdService,
    buscarBrigadasPorComandoIdService,
    buscarBrigadasPorUnidadIdService,
    agregarUnidadesAbrigadaService
} from "@services/brigada.services";

// Controlador para listar brigadas
export const listarBrigadasController = async (_req: Request, res: Response) => {
    try {
        const result = await listarBrigadasService();
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al listar brigadas:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para crear una brigada
export const crearBrigadaController = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const result = await crearBrigadaService(data);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al crear brigada:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para actualizar una brigada
export const actualizarBrigadaController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const result = await editarBrigadaService(id, data);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al actualizar brigada:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para desactivar una brigada
export const desactivarBrigadaController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await desactivarBrigadaService(id);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al desactivar brigada:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para obtener una brigada por su ID
export const obtenerBrigadaPorIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await buscarBrigadaPorIdService(id);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al buscar brigada por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para buscar brigadas por comandoId
export const buscarBrigadasPorComandoIdController = async (req: Request, res: Response) => {
    const { comandoId } = req.params;
    try {
        const result = await buscarBrigadasPorComandoIdService(comandoId);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al buscar brigadas por comando ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para buscar brigadas por unidadId
export const buscarBrigadasPorUnidadIdController = async (req: Request, res: Response) => {
    const { unidadId } = req.params;
    try {
        const result = await buscarBrigadasPorUnidadIdService(unidadId);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al buscar brigadas por unidad ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para agregar unidades a una brigada
export const agregarUnidadesController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { unidadIds } = req.body;
    try {
        const result = await agregarUnidadesAbrigadaService(id, unidadIds);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al agregar unidades a brigada:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};