import express from "express";
import { requiredAuthentication } from "../Middlewares/RequireAuth";
const router = express.Router();
import {
  getConversation,
  PostNewMessage,
} from "../Controllers/Conversation.controller";
router.use(requiredAuthentication);
router.get("/:personId", getConversation);
router.post("/message", PostNewMessage);

export default router;
