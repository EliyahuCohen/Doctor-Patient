import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Rating from "../Models/Rating.model";
import User from "../Models/User.model";
export async function PostFeedback(req: Request, res: Response) {
  const { USER_ID, feedback, rating, doctorId } = req.body;
  if (!isValidObjectId(USER_ID))
    return res
      .status(429)
      .json({ message: "Not allowed to post feedback without login in" });
  if (!feedback || !rating || !doctorId) {
    return res.status(400).json({
      message: "Please add feedback and doctorId and rating and first name",
    });
  } else {
    const user = await User.findById(USER_ID);
    try {
      const oneFeedback = await Rating.create({
        rating: rating,
        feedback: feedback,
        userName: user?.fName + " " + user?.lName,
        doctorId: doctorId,
      }).then((re) => {
        return res.status(201).json({ message: "Feedback posted successfuly" });
      });
    } catch (err) {
      return res.status(500).json({ message: "Feedback posting faild" });
    }
  }
}
export async function getFeedbacks(req: Request, res: Response) {
  const { USER_ID } = req.body;
  const { id } = req.params;
  if (!isValidObjectId(USER_ID))
    return res
      .status(429)
      .json({ message: "Not allowed to post feedback without login in" });
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid doctor id" });
  }
  const feedbacks = await Rating.find({ doctorId: id });
  return res.status(200).json(feedbacks);
}
