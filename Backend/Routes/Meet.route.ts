import express from "express";
import { createMeeting } from "../Controllers/Meet.controller";
const router = express.Router();

router.post("/meet", createMeeting);

export default router;
