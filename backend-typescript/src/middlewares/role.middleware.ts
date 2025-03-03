import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = (rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void | any => {
    const userRoles = req.body?.roles || [];
    const hasRole = userRoles.some((role: string) => rolesPermitidos.includes(role));

    if (!hasRole) {
      return res.status(403).json({ message: 'No tienes el rol necesario para realizar esta acción. Acceso denegado' });
    }

    next();
  };
};