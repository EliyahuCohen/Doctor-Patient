import express from "express";
import { requiredAuthentication } from "../Middlewares/RequireAuth";
const router = express.Router();
import { PostFeedback, getFeedbacks } from "../Controllers/Rating.controller";
router.use(requiredAuthentication);
router.post("/post-feedback", PostFeedback);
router.get("/feedbacks/:id", getFeedbacks);

export default router;
