// src/routes/user.routes.js
import express from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import User from "../../models/User.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});

export default router;
