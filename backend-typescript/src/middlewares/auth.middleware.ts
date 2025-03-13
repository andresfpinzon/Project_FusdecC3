import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "@models/user.model";
import { ENV } from "@config/environments.config";
import { IUser } from "@interfaces/user.interface.";

export interface AuthRequest extends Request {
  user?: IUser; // Agregar el usuario autenticado al request
}

/**
 * Middleware de autenticación
 * Verifica si el usuario está autenticado mediante un accessToken enviado:
 * - En el encabezado Authorization (Bearer Token), o
 * - En una cookie llamada 'token'.
 */
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void | any> => {
  try {
    let token: string | undefined;

    // 🔹 Intentar obtener el accessToken desde las cookies o headers
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 🔹 Si no se encuentra ningún token, responder con error
    if (!token) {
      return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
    }

    // 🔹 Verificar el accessToken
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };

    // 🔹 Buscar al usuario en la base de datos
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado." });
    }

    // 🔹 Adjuntar el usuario al objeto de solicitud
    req.user = user;

    // Continuar con la siguiente función middleware
    next();
  } catch (error: any) {
    console.error(`Error en authMiddleware: ${error.message}`);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido." });
    }
    return res.status(500).json({ message: "Error de autenticación." });
  }
};