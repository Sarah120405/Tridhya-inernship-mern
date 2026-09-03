import express from "express";
import { register } from "./auth.service";

export async function registerController(
  req: express.Request,
  res: express.Response,
) {
  try {
    const registerUser = await register(req.body);
    res.status(201).json(registerUser);
  } catch (err: any) {
    res
      .status(err.status || 500)
      .json(err.message || { message: "Internal Server Error" });
  }
}
