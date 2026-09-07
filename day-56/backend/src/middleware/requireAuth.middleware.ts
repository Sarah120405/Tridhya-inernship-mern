import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function requireAuth(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}
