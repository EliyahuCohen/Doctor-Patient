import express from "express";
import {
  createMeeting,
  getMeetings,
  getUserUpcomingMeetings,
} from "../Controllers/Meet.controller";
import { requiredAuthentication } from "../Middlewares/RequireAuth";
const router = express.Router();

router.use(requiredAuthentication);
router.post("/meet", createMeeting);
router.post("/get-meetings/:doctorId", getMeetings);
router.get("/upcoming-meetings", getUserUpcomingMeetings);

export default router;
