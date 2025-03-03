import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validateSchema = (schema: ZodSchema) => (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { success, error } = schema.safeParse(req.body);
    if (!success) {
      res.status(400).json({
        message: "Validation Error",
        errors: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      });
      return; // Just return without a value
    }
    next();
  };