import express from "express";
import { requiredAuthentication } from "../Middlewares/RequireAuth";
const router = express.Router();
import {
  getConversation,
  PostNewMessage,
} from "../Controllers/Conversation.controller";

router.get("/:personId", requiredAuthentication, getConversation);
router.post("/message", requiredAuthentication, PostNewMessage);

export default router;
