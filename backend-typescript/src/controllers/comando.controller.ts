import { Request, Response } from "express";
import {
    listarComandosServices,
    crearComandoServices,
    actualizarComandoServices,
    desactivarComandoServices,
    buscarComandoPorIdServices,
    agregarBrigadasAComandosServices
} from "@services/comando.services";

// Controlador para listar comandos
export const listarComandosController = async (_req: Request, res: Response) => {
    try {
        const result = await listarComandosServices();
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al listar comandos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para crear un comando
export const crearComandoController = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const result = await crearComandoServices(data);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al crear comando:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para actualizar un comando
export const actualizarComandoController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const result = await actualizarComandoServices(id, data);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al actualizar comando:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para desactivar un comando
export const desactivarComandoController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await desactivarComandoServices(id);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al desactivar comando:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para buscar un comando por su ID
export const buscarComandoPorIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await buscarComandoPorIdServices(id);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al buscar comando por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para agregar brigadas a un comando
export const agregarBrigadasAComandosController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { brigadaIds } = req.body;
    try {
        const result = await agregarBrigadasAComandosServices(id, brigadaIds);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al agregar brigadas a comando:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};