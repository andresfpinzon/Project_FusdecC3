import { z } from 'zod';

export const createUnidadValidation = z.object({
    nombreUnidad: z.string({
        required_error: 'Nombre de la unidad es requerido',
    })
    .min(3, 'El nombre de la unidad debe tener al menos 3 caracteres')
    .max(50, 'El nombre de la unidad no puede exceder 50 caracteres'),

    estadoUnidad: z.boolean().optional().default(true),

    brigadaId: z.string({
        required_error: 'ID de la brigada es requerido',
    }).optional(),

    usuarioId: z.string().optional(),
});

export const updateUnidadValidation = z.object({
    nombreUnidad: z.string()
    .min(3, 'El nombre de la unidad debe tener al menos 3 caracteres')
    .max(50, 'El nombre de la unidad no puede exceder 50 caracteres')
    .optional(),

    estadoUnidad: z.boolean().optional(),

    brigadaId: z.string().optional(),

    usuarioId: z.string().optional(),
}); 