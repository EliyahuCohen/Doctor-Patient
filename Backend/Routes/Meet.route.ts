import express from "express";
import { createMeeting, getMeetings } from "../Controllers/Meet.controller";
import { requiredAuthentication } from "../Middlewares/RequireAuth";
const router = express.Router();

router.use(requiredAuthentication);
router.post("/meet", createMeeting);
router.post("/get-meetings/:doctorId", getMeetings);

export default router;
