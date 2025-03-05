import { z } from 'zod';

export const createComandoValidation = z.object({
    nombreComando: z.string({
        required_error: 'Nombre del comando es requerido',
    })
    .min(3, 'El nombre del comando debe tener al menos 3 caracteres')
    .max(50, 'El nombre del comando no puede exceder 50 caracteres'),

    descripcion: z.string()
        .max(200, 'La descripción no puede exceder 200 caracteres')
        .optional(),

    estadoComando: z.boolean().optional().default(true),
});

export const updateComandoValidation = z.object({
    nombreComando: z.string()
        .min(3, 'El nombre del comando debe tener al menos 3 caracteres')
        .max(50, 'El nombre del comando no puede exceder 50 caracteres')
        .optional(),

    descripcion: z.string()
        .max(200, 'La descripción no puede exceder 200 caracteres')
        .optional(),

    estadoComando: z.boolean().optional(),
});