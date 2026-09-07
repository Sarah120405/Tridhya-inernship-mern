import { Request, Response, NextFunction } from "express";

export function requireRole(requiredRole: string[]) {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!requiredRole.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of: ${requiredRole.join(", ")}`,
      });
    }
    next();
  };
}
