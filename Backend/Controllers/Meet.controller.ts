import { Request, Response } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import Meet from "../Models/Meeting.model";
import User from "../Models/User.model";
import MeetingModel from "../Models/Meeting.model";

export async function createMeeting(req: Request, res: Response) {}

export async function getMeetings(
  req: Request<
    { doctorId: string | ObjectId },
    {},
    { date: Date; day: number }
  >,
  res: Response
) {
  const { doctorId } = req.params;
  if (!isValidObjectId(doctorId))
    return res.status(400).json({ message: "Invalid user id " });
  const { date, day } = req.body;
  const user = await User.findById(doctorId);
  if (!user) return res.status(404).json({ message: "No such user" });
  if (day <= 5 && day >= 0) {
    const schedual = user.schedule[day];
    return res.status(200).json(schedual);
  } else {
    return res
      .status(400)
      .json({ message: "Not a working day in our company" });
  }
}
