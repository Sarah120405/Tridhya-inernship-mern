import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void,
) {
  try {
    const cookieHeader = socket.handshake.headers.cookie;

    if (!cookieHeader) {
      return next(new Error("Authentication cookie required"));
    }

    const tokenCookie = cookieHeader
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    if (!tokenCookie) {
      return next(new Error("Authentication token required"));
    }

    const token = tokenCookie.split("=")[1];

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
    console.error("Socket authentication error:", error);

    next(new Error("Invalid or expired token"));
  }
}
