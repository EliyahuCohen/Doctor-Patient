import express from "express";
import {
  cancelMeeting,
  createMeeting,
  getMeetings,
  getOneMeeting,
  getUserUpcomingMeetings,
  meetingCompleted,
  startMeeting,
  getUserStats,
} from "../Controllers/Meet.controller";
import { requiredAuthentication } from "../Middlewares/RequireAuth";
const router = express.Router();

router.use(requiredAuthentication);
router.post("/meet", createMeeting);
router.get("/get-user-stats/:id", getUserStats);
router.get("/get-one-meeting/:id", getOneMeeting);
router.post("/get-meetings/:doctorId", getMeetings);
router.get("/upcoming-meetings", getUserUpcomingMeetings);
router.patch("/meeting-completed", meetingCompleted);
router.post("/start-meeting", startMeeting);
router.delete("/cancel-meeting/:meetingId", cancelMeeting);

export default router;
