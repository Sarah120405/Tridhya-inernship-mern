import express from "express";
import jwt from "jsonwebtoken";
import { register, login } from "./auth.service";
import { sendResponse } from "../../utils/response";

export async function registerController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const registerUser = await register(req.body);
    return sendResponse(res, 200, "User registered successfully", registerUser);
  } catch (err: any) {
    next(err);
  }
}

export async function loginController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const loginUser = await login(req.body);

    const token = jwt.sign(
      { id: loginUser.id, role: loginUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return sendResponse(res, 201, "User logged in successfully", loginUser);
  } catch (err: any) {
    next(err);
  }
}

export function logoutController(req: express.Request, res: express.Response) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
}
