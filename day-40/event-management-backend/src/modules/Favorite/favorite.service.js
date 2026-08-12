import { Favorite, Event } from "../../models/index.js";

export async function toggleFavorite(userId, eventId) {
  const existing = await Favorite.findOne({ user: userId, event: eventId });

  if (existing) {
    await Favorite.findByIdAndDelete(existing._id);
    return { favorited: false };
  }

  await Favorite.create({ user: userId, event: eventId });
  return { favorited: true };
}

export async function getMyFavorites(userId) {
  const result = await Event.find({ category: "Tech" }).explain(
    "executionStats",
  );
  console.log(result.executionStats);
  return Favorite.find({ user: userId }).populate("event");
}
