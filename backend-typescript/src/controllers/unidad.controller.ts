import { Request, Response } from "express";
import {
    crearUnidadService,
    listarUnidadesService,
    editarUnidadService,
    desactivarUnidadService,
    buscarUnidadPorIdService,
    buscarUnidadesPorBrigadaIdService,
    buscarUnidadesPorUsuarioIdService
} from "@services/unidad.services";

// Controlador para crear una unidad
export const crearUnidadController = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const result = await crearUnidadService(data);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al crear unidad:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para listar unidades
export const listarUnidadesController = async (req: Request, res: Response) => {
    try {
        const result = await listarUnidadesService();
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al listar unidades:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para editar una unidad
export const editarUnidadController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const result = await editarUnidadService(id, data);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al editar unidad:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para desactivar una unidad
export const desactivarUnidadController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await desactivarUnidadService(id);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al desactivar unidad:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para buscar una unidad por su ID
export const buscarUnidadPorIdController = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await buscarUnidadPorIdService(id);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al buscar unidad por ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para buscar unidades por brigadaId
export const buscarUnidadesPorBrigadaIdController = async (req: Request, res: Response) => {
    const { brigadaId } = req.params;
    try {
        const result = await buscarUnidadesPorBrigadaIdService(brigadaId);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al buscar unidades por brigada ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Controlador para buscar unidades por usuarioId
export const buscarUnidadesPorUsuarioIdController = async (req: Request, res: Response) => {
    const { usuarioId } = req.params;
    try {
        const result = await buscarUnidadesPorUsuarioIdService(usuarioId);
        res.status(result.status).json(result);
    } catch (error) {
        console.error("Error al buscar unidades por usuario ID:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};