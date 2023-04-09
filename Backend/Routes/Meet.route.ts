import express from "express";
import {
  cancelMeeting,
  createMeeting,
  getMeetings,
  getUserUpcomingMeetings,
  meetingCompleted,
} from "../Controllers/Meet.controller";
import { requiredAuthentication } from "../Middlewares/RequireAuth";
const router = express.Router();

router.use(requiredAuthentication);
router.post("/meet", createMeeting);
router.post("/get-meetings/:doctorId", getMeetings);
router.get("/upcoming-meetings", getUserUpcomingMeetings);
router.patch("/meeting-completed", meetingCompleted);
router.delete("/cancel-meeting/:meetingId", cancelMeeting);

export default router;
