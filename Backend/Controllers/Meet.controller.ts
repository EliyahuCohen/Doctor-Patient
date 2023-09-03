import { Request, Response } from "express";
import Conversation from "../Models/Conversation.model";
import { isValidObjectId, ObjectId } from "mongoose";
import Meet, { IMeet } from "../Models/Meeting.model";
import User, { ITimeSpan } from "../Models/User.model";
import { io } from "../server";
import { usersID } from "../socket";
import nodemailer from "nodemailer";
import { transporter } from "./User.contoller";
import { NewMeeting } from "../Utils/emails";
import { IUserStats } from "../types/types";
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
  if (!isValidObjectId(doctorId)) {
    return res.status(400).json({ message: "Invalid doctor ID" });
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
          message: "Can't make more than one appointment with the same doctor",
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
      res.status(404).json({ messag: "patient or doctor could not be found" });
    }
    return res.status(400).json({ message: "Something went wrong" });
  }
}
//get
//returns all the available appointments from the given doctor on the requested date
export async function getMeetings(
  //the parameter passed by the url
  req: Request<{ doctorId: string }, {}, { date: string; day: number }>,
  res: Response
) {
  try {
    const { doctorId } = req.params;
    const { date: dateString, day } = req.body;

    if (!isValidObjectId(doctorId)) {
      return res.status(400).json({ message: "Invalid doctor id" });
    }

    const d = new Date(dateString);
    //holds the date that the user picked on the calender
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "No such Doctor" });
    }

    if (day < 0 || day > 5) {
      return res
        .status(400)
        .json({ message: "Not a working day in our company" });
    }

    const meetingInWantedDate = await Meet.find({ date, doctorId: doctorId });

    const schedule = doctor.schedule[day];
    const currentDate = new Date();

    let validTimes = schedule.times.reduce(
      //inserts into isMeetingTimeTaken all the already booked appointments from the schedule
      (timesTemp: ITimeSpan[], time: ITimeSpan) => {
        const isMeetingTimeTaken = meetingInWantedDate.some(
          (meetingTime) => meetingTime.startTime === time.startTime
        );

        if (
          (day === currentDate.getDay() && !isMeetingTimeTaken) ||
          !isMeetingTimeTaken
        )
          timesTemp.push(time);

        return timesTemp;
      },
      []
    );
    const response = {
      day,
      times: validTimes,
    };

    const newDate = new Date();
    if (date.getDate() == newDate.getDate()) {
      let array: ITimeSpan[] = [];
      validTimes.map((value) => {
        if (value.startTime > newDate.getHours() + newDate.getMinutes() / 100) {
          array.push(value);
        }
      });
      response.times = array;
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error while getting meetings:", err);
    return res.status(500).json({ message: "An error occurred" });
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
      const date = new Date();
      for (let i = 0; i < user.meetingsDoctors.length; i++) {
        const meeting = await Meet.findOne({
          _id: user.meetingsDoctors[i]._id,
          date: {
            $gte: new Date(
              `${date.getMonth()}-${date.getDate()}-${date.getFullYear()}`
            ),
          },
          completed: false,
        });
        if (meeting) {
          meetingsDoctors.push(meeting);
        }
      }
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
  const { meetingId, USER_ID, meetingDuration } = req.body;
  if (!isValidObjectId(USER_ID) || !isValidObjectId(meetingId))
    return res.status(400).json({ message: "Invalid Object or meeting ID" });
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
    doctor!.Duration.meetingsAmount++;
    doctor!.Duration.totalDuration += meetingDuration;
  }
  await doctor?.save();
  await patient?.save();
  meeting.completed = true;
  await meeting.save();
  //finding the user for sending request to fire the rating modal
  //check if the user is now online
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
//delete
export async function cancelMeeting(req: Request, res: Response) {
  const { USER_ID } = req.body;
  const { meetingId } = req.params;
  if (!isValidObjectId(USER_ID) || !isValidObjectId(meetingId))
    return res.status(400).json({ message: "Invalid Object or meeting ID" });
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
    if (patient && doctor) {
      const mailOptions: nodemailer.SendMailOptions = {
        from: "careconnecthealthapp@gmail.com",
        to: patient.email,
        subject: `Meeting With Doctor  ${doctor?.fName + " " + doctor?.lName}`,
        html: NewMeeting(meetingUrl),
      };
      const conversation = await Conversation.findOne({
        participants: { $all: [patientId, doctorId] },
      });
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
        await conversation.save();
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
    return res.status(404).json({ message: "Invalid User id" });
  }
}
export async function getOneMeeting(req: Request, res: Response) {
  const { id } = req.params;
  const meeting = await Meet.findById(id);
  if (meeting) return res.status(200).json(meeting);
  return res.status(400).json({ message: "invalid meeting id" });
}
//returns all the
export async function getUserStats(req: Request, res: Response) {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User was not found" });
    //finding the user completed meeting
    const amount = await Meet.find({
      patientId: id,
      completed: true,
    });
    const amount2 = await Meet.find({
      doctorId: id,
      completed: true,
    });

    const stats: IUserStats = {
      doctorsAmount: user.listOfDoctors.length,
      meetingAmount: user.role == 1 ? amount2.length : amount.length,
      patientsAmount: user.listOfPatients.length,
      rating:
        user?.userRating?.sum > 0 && user?.userRating?.votes > 0
          ? user?.userRating.sum / user?.userRating.votes
          : 0,
    };
    //user rating we have in the user object as well doctors and patinets
    return res.status(200).json(stats);
  }
  return res.status(401).json({ message: "Invalid user ID" });
}
