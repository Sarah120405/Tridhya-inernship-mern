import { sendResponse } from "../../utils/response";
import {
  getAllUsers,
  getCustomers,
  getDevelopers,
  getSupportAgents,
  updateUserDetails,
  updateUserPassword,
  updateUserRole,
} from "./user.service";
import express from "express";

export async function getAllUsersController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter =
      typeof req.query.filter === "string" ? req.query.filter : "All";

    const search = typeof req.query.search === "string" ? req.query.search : "";

    const users = await getAllUsers(page, limit, filter, search);

    return sendResponse(res, 200, "Users fetched successfully.", users);
  } catch (error) {
    next(error);
  }
}

export async function getDevelopersController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user = req.user;

    const developers = await getDevelopers(user.id, user.role);

    return sendResponse(
      res,
      200,
      "Developers fetched successfully",
      developers,
    );
  } catch (error) {
    next(error);
  }
}

export async function getCustomersController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user = req.user;

    const customers = await getCustomers(user.id, user.role);

    return sendResponse(res, 200, "Customers fetched successfully", customers);
  } catch (error) {
    next(error);
  }
}
export async function getSupportAgentController(
  req: express.Request & { user?: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user = req.user;

    const supportAgents = await getSupportAgents(user.id, user.role);

    return sendResponse(
      res,
      200,
      "Support Agents fetched successfully",
      supportAgents,
    );
  } catch (error) {
    next(error);
  }
}

export async function updateUserController(
  req: express.Request & { user: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user = await updateUserDetails(req.user.id, req.body);
    return sendResponse(res, 200, "User data updated successfully", user);
  } catch (error) {
    next(error);
  }
}

export async function updatePasswordController(
  req: express.Request & { user: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const user = await updateUserPassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword,
    );
    return sendResponse(res, 200, "Users password updated successfully", user);
  } catch (error) {
    next(error);
  }
}

export async function updateRoleController(
  req: express.Request & { user: any },
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const userId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const user = await updateUserRole(userId, req.body.role);
    return sendResponse(res, 200, "Users role updated successfully", user);
  } catch (error) {
    next(error);
  }
}
