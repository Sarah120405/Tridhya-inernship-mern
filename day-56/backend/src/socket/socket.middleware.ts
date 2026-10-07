import jwt, { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void,
) {
  try {
    const token = socket.handshake.auth?.token; // read from auth payload, not cookie

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & {
      id: string;
      role: string;
    };

    if (!decoded.exp) {
      return next(new Error("Token expiry information is missing"));
    }

    socket.data.user = {
      id: decoded.id,
      role: decoded.role,
      expiresAt: decoded.exp * 1000,
    };

    next();
  } catch (error) {
    console.error("Socket authentication error:", error);
    next(new Error("Invalid or expired token"));
  }
}
