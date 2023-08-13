import User, { Schedule } from "../Models/User.model";
import {
  createAccessToken,
  generateTokenForVarificationCode,
  generateVarificationCode,
  validateEmail,
  ValidateEmailAndPassword,
} from "../Utils/helpers";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { io } from "../server";
import { usersID } from "../socket";
import { ScheduleDay } from "../types/types";
import nodemailer, { Transporter } from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { resetPasswordEmail } from "../Utils/emails";
dotenv.config();

export const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

//post
export async function signup(req: Request, res: Response) {
  const { fName, lName, password, email, location } = req.body;
  if (!fName || !lName || !password || !email || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    ValidateEmailAndPassword(email, password);
    const exists = await User.findOne({ email });
    if (!exists) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      if (req.body.role == 2) req.body.approved = true;
      return User.create({
        ...req.body, //inserts all the fields from req.body
        password: hash,
        messages: [
          {
            message:
              "Thank you for choosing Care Connect as your trusted partner on your journey to better health.",
            type: 1,
          },
        ],
      }).then((result) => {
        const token = createAccessToken(result._id.toString()); //create access token by the new user's id
        return res.status(201).json({ user: result, token });
      });
    }
    return res.status(400).json({ message: "Account with this email already exists" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });
  const exists = await User.findOne({ email });
  if (!exists) return res.status(404).json({ message: "Incorrect Email" });
  const match = await bcrypt.compare(password, exists.password);
  if (match) {
    const token = createAccessToken(exists._id.toString());
    if (exists.role != 0) {
      io.emit("userLoggedIn", exists);
      return res.status(200).json({ user: exists, token });
    }
    return res.status(200).json({ user: exists, token, usersId: usersID }); //returning to the admin all of the logged in users as well
  }
  return res.status(400).json({ message: "Incorrect password" });
}
export async function resetPasswordVerificationCodeEmailSender(
  req: Request,
  res: Response
) {
  const { email } = req.body;
  const exists = await User.findOne({ email });
  if (!exists) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  const varificationCode = generateVarificationCode();
  const varificationCodeToken =
    generateTokenForVarificationCode(varificationCode);

  const mailOptions: nodemailer.SendMailOptions = {
    from: "careconnecthealthapp@gmail.com",
    to: email,
    subject: "Care Connect One Time Verification Code",
    text: `Your verification code is ${varificationCode}`,
    html: resetPasswordEmail(email, varificationCode),
  };

  try {
    await transporter.sendMail(mailOptions);
    exists.varificationCode = varificationCodeToken;
    await exists.save();
    return res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to send email. Please try again" });
  }
}
export async function checkIfVerificationCodeIsValidAndCorrect(
  req: Request,
  res: Response
) {
  const { code, email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const decodedToken: any = jwt.verify(
        user?.varificationCode,
        `${process.env.SECRET}`
      );
      if (decodedToken && decodedToken.code === code) {
        return res.status(200).json({ message: "You are verified" });
      } else {
        return res.status(400).json({ message: "Invalid code" });
      }
    }
  } catch (err) {
    return res.status(400).json({ message: "Code expired" });
  }
}
export async function changePassword(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User was not found!" });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  user.password = hash;
  await user.save();

  return res.status(201).json({ message: "Password successfully updated!" });
}
//get
//returns all the users for the admin
export async function getAllUsers(req: Request, res: Response) {
  const { USER_ID } = req.body;
  const user = await User.findById(USER_ID);
  if (user && user.role == 0) {
    const users = await User.find({ _id: { $ne: USER_ID } })
      .sort({ _createdAt: "descending" })
      .then((result) => result);
    return res.status(200).json({ users, usersId: usersID });
  } else {
    return res
      .status(429)
      .json({ message: "You don't have access to this information" });
  }
}
export async function findOneUser(req: Request, res: Response) {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid user ID" });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "No such user!" });
  return res.status(200).json(user);
}
export async function getAllDoctors(req: Request, res: Response) {
  const doctors = await User.find({ role: 1, approved: true });
  return res.status(200).json(doctors);
}
export async function postSchedual(
  req: Request<{}, {}, { USER_ID: any; weeklySchedual: ScheduleDay[] }>,
  res: Response
) {
  const { USER_ID, weeklySchedual } = req.body;
  if (isValidObjectId(USER_ID)) {
    const user = await User.findById(USER_ID);
    if (!user) return res.status(404).json({ message: "No such user" });
    //taking only the useful parts of the schedule w/o the day of the week as a word
    const ws: Schedule[] = weeklySchedual.map((one) => {
      return one.schedule;
    });
    if (user.schedule) {
      user.schedule = ws;
    }
    user.messages.push({ message: "Your schedual list has been updated", type: 2 });
    return await user.save().then((r) => {
      const ws: ScheduleDay[] = r.schedule.map((one) => {
        return {
          day: "",
          schedule: { day: one.day, times: one.times },
        };
      });
      return res.status(200).json(ws);
    });
  }
  return res.status(400).json({ message: "Invalid user ID" });
}
export async function getUserDoctorsAndPatients(req: Request, res: Response) {
  const { USER_ID } = req.body;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Not valid object id" });
  const user = await User.findById(USER_ID);
  if (!user) return res.status(404).json({ message: "No Such user" });
  let patientsArray: any = [];
  let doctorsArray: any = [];

  for (let i = 0; i < user.listOfDoctors.length; i++) {
    const temp = await User.findOne({
      _id: user.listOfDoctors[i],
      approved: true,
    });
    if (temp) {
      doctorsArray.push(temp);
    }
  }
  for (let i = 0; i < user.listOfPatients.length; i++) {
    const temp = await User.findOne({
      _id: user.listOfPatients[i],
      approved: true,
    });
    if (temp) {
      patientsArray.push(temp);
    }
  }
  res.status(200).json({ doctorsArray, patientsArray });
}
export async function getSystemMessages(req: Request, res: Response) {
  const { USER_ID } = req.body;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Not valid object id" });
  const messages = await User.findOne(
    { _id: USER_ID },
    { messages: 1, _id: 0 }
  );
  res.status(200).json(messages?.messages.reverse());
}
//for a doctor to view his own schedule
export async function getSchedual(
  req: Request<{}, {}, { USER_ID: any }>,
  res: Response
) {
  const { USER_ID } = req.body;
  if (isValidObjectId(USER_ID)) {
    const user = await User.findById(USER_ID);
    if (!user || user.role != 1)
      return res.status(404).json({ message: "No such user/doctor" });
    const ws: ScheduleDay[] = user.schedule.map((one) => {
      return {
        day: "",
        schedule: { day: one.day, times: one.times },
      } as any;
    });
    return res.status(200).json({ schedual: ws });
  }
  return res.status(400).json({ message: "Invalid user ID" });
}
//update
export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(403).json({ message: "Invalid user ID" });
  if (req.body.role == 1)
    return res.status(403).json({ message: "Not able to change the role" });
  await User.updateOne({ _id: id }, { $set: { ...req.body.user } });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "No such user!" });
  user?.messages.push({
    type: 1,
    message: "Your information was updated successfully",
  });
  await user?.save();
  return res.status(200).json(user);
}
//for the admin to change the approval status of the users 
export async function updatePermissions(req: Request, res: Response) {
  const { USER_ID } = req.body;
  const { id } = req.params;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Not valid user id" });
  const user = await User.findById(USER_ID);
  if (!user) return res.status(404).json({ message: "User does not exists" });
  if (user.role != 0)
    return res.status(404).json({ message: "Only admin can change roles." });
  const user1 = await User.findById(id);
  if (user1) {
    user1.messages.push({
      type: user1.approved == true ? 3 : 1,
      message:
        user1.approved == true
          ? "Sorry, you've been blocked by the admin"
          : "Congratulation you've been approved by the admin",
    });
    await user1.save();
    const liveUser = usersID.filter((u) => u.userId == (id as Object))[0];
    if (liveUser) {
      io.to(liveUser.socketId).emit("isApprove", {
        approve: !user1.approved,
        message: user1.messages[user1.messages.length - 1],
      });
    }
  } else {
    return res.status(404).json({ message: "user not found" });
  }
  await User.findByIdAndUpdate(id, {
    $set: {
      approved: !user1?.approved,
    },
  }).then(() => {
    return res.status(202).json({ message: "User was updated successfully" });
  });
}
export async function updateDoctorsList(req: Request, res: Response) {
  const { id } = req.params;
  const { USER_ID } = req.body;
  if (isValidObjectId(id)) {
    const user = await User.findById(USER_ID);
    const doctor = await User.findById(id);
    let doc = id as any;
    if (doctor && doctor.role == 1) {
      //if he already has the doctor on his list we want to remove it
      if (user?.listOfDoctors.includes(doc)) {
        user.listOfDoctors = user.listOfDoctors.filter((one) => one != doc);
        doctor.listOfPatients = doctor.listOfPatients.filter(
          (pat) => pat != USER_ID
        );

      } else //we just want to add it 
      {
        user?.listOfDoctors.push(doc);
        doctor?.listOfPatients.push(USER_ID);
      }
      await user?.save();
      await doctor?.save();
      return res.status(201).json(user);
    }
    else {
      return res.status(400).json({ message: "He is not even a doctor!" });
    }
  }
  return res.status(400).json({ message: "No Such User Id" });
}

//delete
export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid user ID" });
  const deleted = await User.findByIdAndDelete(id);
  if (deleted) {
    return res.status(202).json({ message: "User deleted" });
  }
  return res.status(400).json({ message: "User does NOT exists" });
}
//validation
export async function checkAccess(req: Request, res: Response) {
  return res.status(200).json({ message: "Validation Successful" });
}
export async function addRatingToDoctor(req: Request, res: Response) {
  const { USER_ID, rating, doctorId } = req.body;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Invalid user ID" });
  const doctor = await User.findById(doctorId);
  if (!doctor)
    return res
      .status(404)
      .json({ message: "Can't find doctor to rate, sorry!" });
  doctor.userRating.sum += rating;
  doctor.userRating.votes = doctor.userRating.votes + 1; 
  await doctor.save();
  return res.status(200).json({ message: "Thanks for your feedback!" });
}
export async function validateEmailAndExists(req: Request, res: Response) {
  const { email } = req.body;
  const emailExists = await User.findOne({ email });
  if (emailExists) return res.status(400).json({ message: "Email exists" });
  return res.status(200).json({ message: "Good email" });
}
