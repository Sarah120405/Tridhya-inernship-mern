// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  console.log("Cookies received:", req.cookies);
  console.log("Raw cookie header:", req.headers.cookie);

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
