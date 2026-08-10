import express from "express";
import {
  toggleFavoriteController,
  getMyFavoritesController,
} from "./favorite.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { objectIdSchema } from "./favourite.validator.js";
import z from "zod";

const router = express.Router();
const evendIdParamsSchema = z.object({
  id: objectIdSchema,
});
router.post(
  "/:id",
  requireAuth,
  validate(evendIdParamsSchema),
  toggleFavoriteController,
);
router.get("/", requireAuth, getMyFavoritesController);

export default router;
