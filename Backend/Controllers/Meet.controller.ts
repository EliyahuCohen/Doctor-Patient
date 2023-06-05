import { Request, Response } from "express";
import Conversation from "../Models/Conversation.model";
import { isValidObjectId, ObjectId } from "mongoose";
import Meet, { IMeet } from "../Models/Meeting.model";
import User, { ITimeSpan } from "../Models/User.model";
import { io } from "../server";
import { usersID } from "../socket";
import nodemailer from "nodemailer";
import Message from "../Models/Conversation.model"
//post
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

    const patient = await User.findById(USER_ID);
    const doctor = await User.findById(doctorId);
    if (patient && doctor) {
      const hasMeeting = await Meet.find({
        doctorId: doctorId,
        patientId: USER_ID,
        completed: false,
      });
      if (hasMeeting.length > 0)
        return res.status(400).json({
          message: "Can't make more than one appintment with the same doctor",
        });
      const meeting = await Meet.create({
        date,
        doctorId,
        endTime,
        patientId: USER_ID,
        startTime,
        doctorName: doctor.fName + " " + doctor.lName,
        patientName: patient.fName + " " + patient.lName,
        completed: false,
      });
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
//get
export async function getMeetings(
  req: Request<
    { doctorId: string | ObjectId },
    {},
    { date: string; day: number }
  >,
  res: Response
) {
  try {
    const { doctorId } = req.params;
    if (!isValidObjectId(doctorId))
      return res.status(400).json({ message: "Invalid user id " });
    const { date: dateString, day } = req.body;
    const d = new Date(dateString);
    const date = new Date(
      `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`
    );
    const user = await User.findById(doctorId);
    if (!user) return res.status(404).json({ message: "No such user" });
    if (day <= 5 && day >= 0) {
      const meetingInWantedDate = await Meet.find({ date });
      // more things
      const schedual = user.schedule[day];
      const timesTemp: ITimeSpan[] = [];

      if (schedual?.times) {
        for (let i = 0; i < schedual.times.length; i++) {
          for (let j = 0; j < meetingInWantedDate.length; j++) {
            if (
              schedual.times[i].startTime == meetingInWantedDate[j].startTime
            ) {
              schedual.times[i] = { endTime: 0, startTime: 0 };
            }
          }
        }

        for (let j = 0; j < schedual.times.length; j++) {
          if (
            schedual.times[j].startTime != 0 &&
            schedual.times[j].endTime != 0
          ) {
            timesTemp.push(schedual.times[j]);
          }
        }
        schedual.times = timesTemp as any;
      }
      if (schedual?.times && day == new Date().getDay()) {
        let result = schedual.times.filter((one) => {
          return one.startTime >= new Date().getHours();
        });
        schedual.times = result as any;
      }
      return res.status(200).json(schedual);
    } else {
      return res
        .status(400)
        .json({ message: "Not a working day in our company" });
    }
  } catch (err) {
    console.log("err available get meetings");
  }
}
export async function getUserUpcomingMeetings(req: Request, res: Response) {
  //showing meetings with doctor also of the future meetings but with patinets the doctor need to see only his today's meetings make sence
  const { USER_ID } = req.body;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Invalid use ID" });
  try {
    const user = await User.findById(USER_ID);
    if (user) {
      const meetingsDoctors: IMeet[] = [];
      const meetingsPatients: IMeet[] = [];
      const d = new Date();
      for (let i = 0; i < user.meetingsDoctors.length; i++) {
        const meeting = await Meet.findOne({
          _id: user.meetingsDoctors[i]._id,
          date: {
            $gte: new Date(`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`),
          },
          completed: false,
        });
        if (meeting) {
          meetingsDoctors.push(meeting);
        }
      }
      const date = new Date();

      for (let i = 0; i < user.meetingsPatients.length; i++) {
        const meeting = await Meet.findOne({
          _id: user.meetingsPatients[i]._id,
          date: new Date(
            `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
          ),
          completed: false,
        });
        if (meeting) {
          meetingsPatients.push(meeting);
        }
      }
      return res.status(200).json({ meetingsDoctors, meetingsPatients });
    }
  } catch (err: any) {
    console.log("err user getting meetings");
  }
  return res.status(404).json({ message: "No such User" });
}
//update
export async function meetingCompleted(req: Request, res: Response) {
  const { meetingId, USER_ID } = req.body;
  if (!isValidObjectId(USER_ID) || !isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Invalid Object ID" });
  const meeting = await Meet.findOne({ _id: meetingId });
  if (!meeting)
    return res.status(404).json({ message: "No such meeting in db" });
  const doctor = await User.findById(meeting.doctorId);
  const patient = await User.findById(meeting.patientId);
  if (doctor && patient) {
    doctor.meetingsPatients.splice(
      doctor.meetingsPatients.findIndex((one) => one == meeting._id),
      1
    );
    patient.meetingsDoctors.splice(
      patient.meetingsDoctors.findIndex((one) => one == meeting._id),
      1
    );
    doctor.meetingAmount++;
  }
  await doctor?.save();
  await patient?.save();
  meeting.completed = true;
  await meeting.save();
  //finding the user for sending request to fire the rating modal
  const exists = usersID.filter(
    (one) => one.userId == (meeting.patientId as any)
  )[0];
  if (exists) {
    io.to(exists.socketId).emit("post-rating", {
      message: doctor?.fName,
      doctorId: doctor?._id,
    });
  }

  return res.status(200).json({ message: "Meeting updated" });
}
import { transporter } from "./User.contoller";
import { NewMeeting } from "../Utils/emails";
import { IConversation } from "../Models/Conversation.model";
//delete
export async function cancelMeeting(req: Request, res: Response) {
  const { USER_ID } = req.body;
  const { meetingId } = req.params;
  if (!isValidObjectId(USER_ID) || !isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Invalid Object ID" });
  const meeting = await Meet.findOne({ _id: meetingId });
  if (!meeting)
    return res.status(404).json({ message: "No such meeting in db" });
  const doctor = await User.findById(meeting.doctorId);
  const patient = await User.findById(meeting.patientId);
  if (doctor && patient) {
    doctor.meetingsPatients.splice(
      doctor.meetingsPatients.findIndex((one) => one == meeting._id),
      1
    );
    patient.meetingsDoctors.splice(
      patient.meetingsDoctors.findIndex((one) => one == meeting._id),
      1
    );
  }
  await doctor?.save();
  await patient?.save();
  await Meet.findByIdAndDelete(meeting._id);
  return res.status(200).json({ message: "Meeting Was Canceled" });
}
export async function startMeeting(
  req: Request<
    {},
    {},
    { USER_ID: any; doctorId: string; patientId: string; meetingUrl: string }
  >,
  res: Response
) {
  const { USER_ID, doctorId, patientId, meetingUrl } = req.body;
  if (!USER_ID || !doctorId || !patientId || !meetingUrl)
    return res.status(400).json({ message: "missing info " });
  if (isValidObjectId(USER_ID)) {
    const patient = await User.findById(patientId);
    const doctor = await User.findById(doctorId);
    if (patient) {
      const mailOptions: nodemailer.SendMailOptions = {
        from: "careconnecthealthapp@gmail.com",
        to: patient.email,
        subject: `Meeting With Doctor  ${doctor?.fName + " " + doctor?.lName}`,
        html: NewMeeting(meetingUrl),
      };
      const conversation= await Conversation.findOne({
        participants: { $all: [patientId, doctorId] }
      })
      if (conversation) {
        conversation.messages.push({
          sender: USER_ID as any,
          message: "I'm sending you a link to the appointment,\n please join.",
          createdAt: new Date(),
          read: false,
        });
        conversation.messages.push({
          sender: USER_ID as any,
          message: meetingUrl,
          createdAt: new Date(),
          read: false,
        });
        await conversation.save()
      }
      try {
        await transporter.sendMail(mailOptions);
        return res
          .status(200)
          .json({ message: `Meeting url was send to ${patient.email}` });
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: "Failed to send email. Please try again" });
      }
    } else {
      return res.status(404).json({ message: "User was not found" });
    }
  } else {
    return res.status(404).json({ message: "User was not found" });
  }
}
export async function getOneMeeting(req: Request, res: Response) {
  const { id } = req.params
  const meeting = await Meet.findById(id)
  if (meeting) return res.status(200).json(meeting)
  return res.status(400).json({ message: "invalid meeting id" })
}
