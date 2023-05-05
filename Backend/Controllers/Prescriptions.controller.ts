import { Request, Response } from "express";
import Prescription from "../Models/Prescription.model";
import { isValidObjectId } from "mongoose";
import { io } from "../server";
import { ReqMessage } from "./Conversation.controller";
import { usersID } from "../socket";
//get
export async function getPrescriptions(req: Request, res: Response) {
  const { USER_ID } = req.body;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Invalid user id" });
  const prescriptions = await Prescription.find({
    patinetId: USER_ID,
    endDate: { $gte: new Date() },
  });
  return res.status(200).json(prescriptions);
}
//post
export async function newPrescription(req: Request, res: Response) {
  const {
    USER_ID,
    doctorId,
    patinetId,
    doctorName,
    medications,
    endDate,
    title,
  } = req.body;
  if (!isValidObjectId(USER_ID))
    return res.status(400).json({ message: "Invalid user id" });
  try {
    const prescription = await Prescription.create({
      doctorId,
      doctorName,
      endDate,
      medications,
      patinetId,
      title,
    })
      .then((r) => {
        const userId = usersID.filter((one) => one.userId == patinetId)[0];
        if (userId?.socketId) {
          io.to(userId.socketId).emit("newPrescription", r);
        }
        return res
          .status(201)
          .json({ message: "Prescription has been assigned successfuly" });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Invalid Input Values " });
      });
  } catch (err) {
    return res.status(400).json({ message: "All Fields are required" });
  }
}
//update
export async function updatePrescription(req: Request, res: Response) {}
//delete
export async function deletePrescription(req: Request, res: Response) {}
