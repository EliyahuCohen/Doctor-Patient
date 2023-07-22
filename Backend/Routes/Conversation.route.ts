import express from "express";
import { requiredAuthentication } from "../Middlewares/RequireAuth";
import { getConversation, PostNewMessage } from "../Controllers/Conversation.controller";
const router = express.Router();
router.use(requiredAuthentication);
router.get("/:personId", getConversation);
router.post("/message", PostNewMessage);

export default router;
