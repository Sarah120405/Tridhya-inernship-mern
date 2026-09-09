import express from "express";
import authRoute from "./modules/Auth/auth.route";
import ticketRoute from "./modules/Ticket/ticket.route";
import messageRoute from "./modules/Messages/message.route";
import internalMsgRoute from "./modules/InternalMessages/internalMsg.route";
import slaRoute from "./modules/Sla/sla.route";
import aiRoute from "./modules/AI/ai.route";

const app = express.Router();
app.use("/auth", authRoute);
app.use("/tickets", ticketRoute);
app.use("/messages", messageRoute);
app.use("/internal-messages", internalMsgRoute);
app.use("/sla", slaRoute);
app.use("/ai", aiRoute);
export default app;
