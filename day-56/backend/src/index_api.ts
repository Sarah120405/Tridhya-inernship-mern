import express from "express";
import authRoute from "./modules/Auth/auth.route";
import ticketRoute from "./modules/Ticket/ticket.route";
import messageRoute from "./modules/Messages/message.route";
import internalMsgRoute from "./modules/InternalMessages/internalMsg.route";

const app = express.Router();
app.use("/auth", authRoute);
app.use("/tickets", ticketRoute);
app.use("/messages", messageRoute);
app.use("/internal-messages", internalMsgRoute);

export default app;
