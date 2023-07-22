import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import Rating from "../Models/Rating.model";
import User from "../Models/User.model";
export async function PostFeedback(req: Request, res: Response) {
  const { USER_ID, feedback, rating, doctorId } = req.body;
  //check if user id is a valid MongoDB id
  if (!isValidObjectId(USER_ID))
    return res
      .status(429)
      .json({ message: "Not allowed to post feedback without login in" });
  if ( !rating || !doctorId) {
    return res.status(400).json({
      message: "Please fill all required fields.",
    });
  } else {
    const user = await User.findById(USER_ID);
    if(!user)
    return res.status(404).json({message:"user not found"})
    try {
      const oneFeedback = await Rating.create({
        rating: rating,
        feedback: feedback,
        userName: user.fName + " " + user.lName,
        doctorId: doctorId,
      }).then(async (re) => {
        const doctor = await User.findById(doctorId);
        if (doctor) {
          doctor.userRating.sum += rating;
          doctor.userRating.votes++;
          await doctor.save();
        }
        return res.status(201).json({ message: "Feedback posted successfully" });
      });
    } catch (err) {
      return res.status(500).json({ message: "Feedback posting failed" });
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
  //find all feedbacks of the doctor by his id passed in the route
  const feedbacks = await Rating.find({ doctorId: id });
  return res.status(200).json(feedbacks);
}
