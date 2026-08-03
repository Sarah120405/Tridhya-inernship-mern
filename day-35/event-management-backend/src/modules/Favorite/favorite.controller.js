import { toggleFavorite, getMyFavorites } from "./favorite.service.js";

export async function toggleFavoriteController(req, res) {
  try {
    const favorite = await toggleFavorite(req.user.id, req.params.id);
    res.status(200).json(favorite);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}

export async function getMyFavoritesController(req, res) {
  try {
    const favorites = await getMyFavorites(req.user.id);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
}
