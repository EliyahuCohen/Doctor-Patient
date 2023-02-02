import { socket } from "../server";
import { Request, Response } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import Meet from "../Models/Meeting.model";
import User from "../Models/User.model";
import MeetingModel from "../Models/Meeting.model";

export async function createMeeting(
  req: Request<
    {},
    {},
    { doctorID: ObjectId; patientID: ObjectId; time: Date },
    {}
  >,
  res: Response
) {
  const { doctorID, patientID, time } = req.body;
  if (!isValidObjectId(doctorID) || !isValidObjectId(patientID))
    return res.status(400).json({ message: "Invalid objectId" });
  await Meet.create({ patientID, doctorID, time }).then(async (result) => {
    try {
      const { _id } = result;
      User.findOneAndUpdate(
        { role: 1, _id: doctorID },
        {
          $push: { mettings: _id },
        }
      ).then((r) => console.log(r));
      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  });
}
