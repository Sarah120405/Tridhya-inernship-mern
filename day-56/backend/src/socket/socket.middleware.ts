import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void,
) {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication token required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    socket.data.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    next(new Error("Invalid or expired token"));
  }
}
