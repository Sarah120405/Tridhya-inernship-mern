import {
  getOrganizerStats,
  getAdminStats,
  getRecentActivity,
  getBookingTrends,
  updateUserRole,
  getAllUsers,
} from "./user.service.js";

export async function getOrganizerStatsController(req, res) {
  try {
    const stats = await getOrganizerStats(req.user.id);
    res.status(200).json(stats);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

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

export async function updateUserRoleController(req, res) {
  try {
    const userRole = await updateUserRole(
      req.params.id,
      req.body.role,
      req.user.id,
    );
    res.status(200).json(userRole);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getAllUsersController(req, res) {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
