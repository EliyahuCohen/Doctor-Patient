import { Request, Response } from "express";
import { isValidObjectId, ObjectId } from "mongoose";
import Meet from "../Models/Meeting.model";
import User, { ITimeSpan, Schedule } from "../Models/User.model";

export async function createMeeting(
  req: Request<
    {},
    {},
    {
      startTime: number;
      date: string;
      endTime: number;
      doctorId: ObjectId;
      USER_ID: ObjectId;
    }
  >,
  res: Response
) {
  const { date: dateString, doctorId, endTime, startTime, USER_ID } = req.body;
  if (!isValidObjectId(USER_ID)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }
  if (!dateString || !doctorId || !endTime || !USER_ID || !startTime)
    return res.status(400).json({ message: "All fields are required" });
  else {
    const date = new Date(dateString);
    const meeting = await Meet.create({
      date,
      doctorId,
      endTime,
      patientId: USER_ID,
      startTime,
    });
    const patient = await User.findById(USER_ID);
    const doctor = await User.findById(doctorId);
    if (patient && doctor) {
      patient.meetingsDoctors.push(meeting._id);
      doctor.meetingsPatients.push(meeting._id);
      await doctor.save();
      await patient.save();
      return res
        .status(201)
        .json({ message: "Meetings schedualed successfuly" });
    } else {
      res.status(404).json({ messag: "patinet or doctor could not be found" });
    }
    return res.status(400).json({ message: "Cant do that" });
  }
}

export async function getMeetings(
  req: Request<
    { doctorId: string | ObjectId },
    {},
    { date: string; day: number }
  >,
  res: Response
) {
  const { doctorId } = req.params;
  if (!isValidObjectId(doctorId))
    return res.status(400).json({ message: "Invalid user id " });
  const { date: dateString, day } = req.body;
  const d = new Date(dateString);
  const date = new Date(
    `${d.getMonth() + 1}-${d.getDate() + 1}-${d.getFullYear()}`
  );
  const user = await User.findById(doctorId);
  if (!user) return res.status(404).json({ message: "No such user" });
  if (day <= 5 && day >= 0) {
    const meetingInWantedDate = await Meet.find({ date });
    // more things
    const schedual = user.schedule[day];
    const timesTemp: ITimeSpan[] = [];
    for (let i = 0; i < schedual.times.length; i++) {
      for (let j = 0; j < meetingInWantedDate.length; j++) {
        if (schedual.times[i].startTime == meetingInWantedDate[j].startTime) {
          schedual.times[i] = { endTime: 0, startTime: 0 };
        }
      }
    }
    for (let j = 0; j < schedual.times.length; j++) {
      if (schedual.times[j].startTime != 0 && schedual.times[j].endTime != 0) {
        timesTemp.push(schedual.times[j]);
      }
    }
    schedual.times = timesTemp as any;
    return res.status(200).json(schedual);
  } else {
    return res
      .status(400)
      .json({ message: "Not a working day in our company" });
  }
}
