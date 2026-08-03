import express from "express";
import {
  toggleFavoriteController,
  getMyFavoritesController,
} from "./favorite.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:id", requireAuth, toggleFavoriteController);
router.get("/", requireAuth, getMyFavoritesController);

export default router;
