import express from "express";
import { createMeeting, getMeetings } from "../Controllers/Meet.controller";
const router = express.Router();

router.post("/meet", createMeeting);
router.post("/get-meetings/:doctorId", getMeetings);

export default router;
