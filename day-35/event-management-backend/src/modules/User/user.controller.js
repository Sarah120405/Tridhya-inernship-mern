// admin.controller.js
import {
  getAdminStats,
  getRecentActivity,
  getBookingTrends,
} from "./user.service.js";

export async function getAdminStatsController(req, res) {
  try {
    const stats = await getAdminStats();
    res.status(200).json(stats);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getRecentActivityController(req, res) {
  try {
    const activity = await getRecentActivity();
    res.status(200).json(activity);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getBookingTrendsController(req, res) {
  try {
    const trends = await getBookingTrends();
    res.status(200).json(trends);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
