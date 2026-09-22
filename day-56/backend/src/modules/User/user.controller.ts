import { sendResponse } from "../../utils/response";
import { getCustomers, getDevelopers, getSupportAgents } from "./user.service";
import express from "express";

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
