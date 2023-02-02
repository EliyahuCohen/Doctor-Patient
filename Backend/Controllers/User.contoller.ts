import User from "../Models/User.model";
import { createAccessToken, ValidateEmailAndPassword } from "../Utils/helpers";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

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
      return User.create({ ...req.body, password: hash }).then((result) => {
        const token = createAccessToken(result._id.toString());
        return res.status(201).json({ result, token });
      });
    }
    return res.status(400).json({ message: "Email already in use" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
}
export async function getAllUsers(req: Request, res: Response) {
  const users = await User.find({}).then((result) => result);
  return res.status(200).json(users);
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
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });
  const exists = await User.findOne({ email });
  if (!exists) return res.status(404).json({ message: "Incorrect Email" });
  const match = await bcrypt.compare(password, exists.password);
  if (match) {
    const token = createAccessToken(exists._id.toString());
    return res.status(200).json({ exists, token });
  }
  return res.status(400).json({ message: "Incorrect password" });
}
