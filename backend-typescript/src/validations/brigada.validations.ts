import { z } from 'zod';

export const createBrigadaValidation = z.object({
    nombreBrigada: z.string({
        required_error: 'Nombre de la brigada es requerido',
    })
    .min(3, 'El nombre de la brigada debe tener al menos 3 caracteres')
    .max(50, 'El nombre de la brigada no puede exceder 50 caracteres'),

    ubicacionBrigada: z.string({
        required_error: 'Ubicación de la brigada es requerida',
    })
    .min(3, 'La ubicación de la brigada debe tener al menos 3 caracteres')
    .max(100, 'La ubicación de la brigada no puede exceder 100 caracteres'),

    estadoBrigada: z.boolean().optional().default(true),
});

export const updateBrigadaValidation = z.object({
    nombreBrigada: z.string()
    .min(3, 'El nombre de la brigada debe tener al menos 3 caracteres')
    .max(50, 'El nombre de la brigada no puede exceder 50 caracteres')
    .optional(),

    ubicacionBrigada: z.string()
    .min(3, 'La ubicación de la brigada debe tener al menos 3 caracteres')
    .max(100, 'La ubicación de la brigada no puede exceder 100 caracteres')
    .optional(),

    estadoBrigada: z.boolean().optional(),
}); 