import express from "express";
import { getSLA } from "./sla.controller";

const route = express.Router();
route.get("/:ticketId", getSLA);

export default route;
