import User from "../Models/User.model";
import { createAccessToken, ValidateEmailAndPassword } from "../Utils/helpers";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { io } from "../server";
import { usersID } from "../server";
import { IMessage } from "../Models/Conversation.model";

export async function signup(req: Request, res: Response) {
  const { fName, lName, password, email, location, isMale } = req.body;
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
        ...req.body,
        password: hash,
        messages: [
          {
            message: "Thank you for using Eden for you'r health care provider ",
            type: 1,
          },
          {
            message: "Please change you'r password we might have a date loop ",
            type: 2,
          },
          {
            message:
              "you have 7 days to make the payment or you wont be able to use the servcie ",
            type: 3,
          },
        ],
      }).then((result) => {
        const token = createAccessToken(result._id.toString());
        io.emit("newUser", { user: result });
        return res.status(201).json({ user: result, token });
      });
    }
    return res.status(400).json({ message: "Email already in use" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
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
      .json({ message: "You dont have access to this information" });
  }
}
export async function findOneUser(req: Request, res: Response) {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(403).json({ message: "Invalid user ID" });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "No such user!" });
  return res.status(200).json(user);
}
export async function updateUser(req: Request, res: Response) {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(403).json({ message: "Invalid user ID" });
  if (req.body.role)
    return res.status(403).json({ message: "Not able to change the role" });
  await User.updateOne({ _id: id }, { $set: { ...req.body } });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ message: "No such user!" });
  return res.status(200).json(user);
}
export async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;
  if (!isValidObjectId(id))
    return res.status(403).json({ message: "Invalid user ID" });
  const deleted = await User.findByIdAndDelete(id);
  if (deleted) {
    return res.status(202).json({ message: "User deleted" });
  }
  return res.status(400).json({ message: "User dose NOT exists" });
}
export async function updateRole(req: Request, res: Response) {
  const { USER_ID } = req.body;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Not valid object id" });
  const user = await User.findById(USER_ID);
  if (!user) return res.status(404).json({ message: "User dose not exists" });
  User.findByIdAndUpdate(
    { USER_ID },
    {
      $set: {
        approved: true,
      },
    }
  ).then(() => {
    return res.status(202).json({ message: "User was updated" });
  });
}
export async function getSystemMessages(req: Request, res: Response) {
  const { USER_ID } = req.body;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Not valid object id" });
  const messages = await User.findOne(
    { _id: USER_ID },
    { messages: 1, _id: 0 }
  );
  res.status(200).json(messages?.messages);
}
export async function getUserDoctorsAndPatients(req: Request, res: Response) {
  const { USER_ID } = req.body;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Not valid object id" });
  const user = await User.findById(USER_ID);
  if (!user) return res.status(404).json({ message: "No Such user" });
  const patientsArray: any = [];
  const doctorsArray: any = [];

  for (let i = 0; i < user.listOfDoctors.length; i++) {
    const temp = await User.findById(user.listOfDoctors[i]);
    if (temp) {
      doctorsArray.push(temp);
    }
  }
  for (let i = 0; i < user.listOfPatients.length; i++) {
    const temp = await User.findById(user.listOfPatients[i]);
    if (temp) {
      patientsArray.push(temp);
    }
  }
  res.status(200).json({ doctorsArray, patientsArray });
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
    io.emit("userLoggedIn", exists);
    if (exists.role != 0) return res.status(200).json({ user: exists, token });
    return res.status(200).json({ user: exists, token, usersId: usersID });
  }
  return res.status(400).json({ message: "Incorrect password" });
}
