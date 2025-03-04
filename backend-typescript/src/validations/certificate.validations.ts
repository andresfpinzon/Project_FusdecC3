import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const certificateSchema = z.object({
    nameEmisor: z.string({
        required_error: "Name emisor is required",
        invalid_type_error: "Name emisor must be a string"
    }),
    fechaEmision: z.coerce.date({
        required_error: "Fecha emision is required",
        invalid_type_error: "Fecha emision must be a valid date"
    }),
    codigoVerify: z.string({
        required_error: "Codigo verify is required",
        invalid_type_error: "Codigo verify must be a string"
    }),
    isActive: z.boolean({
        required_error: "isActive is required",
        invalid_type_error: "isActive must be a boolean"
    }),
    usuario: z.string().regex(/^[0-9a-fA-F]{24}$/, "Usuario must be a valid MongoDB ID").optional(),
    curso: z.string().regex(/^[0-9a-fA-F]{24}$/, "Curso must be a valid MongoDB ID").optional(),
    estudiante: z.string().regex(/^[0-9a-fA-F]{24}$/, "Estudiante must be a valid MongoDB ID").optional()
});

const updateCertificateSchema = certificateSchema.partial();

const idSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID must be a valid MongoDB ID")
});

export const validateCreateCertificate = (req: Request, res: Response, next: NextFunction) => {
    try {
        certificateSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        }
        next(error);
    }
};

export const validateUpdateCertificate = (req: Request, res: Response, next: NextFunction) => {
    try {
        updateCertificateSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        }
        next(error);
    }
};

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
    try {
        idSchema.parse({ id: req.params.id });
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors
            });
        }
        next(error);
    }
};