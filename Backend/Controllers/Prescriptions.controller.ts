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
    endDate: { $gte: new Date() },//only not expired prescriptions
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
      .then((createdPrescription) => {
        const liveUser = usersID.filter((one) => one.userId == patinetId)[0];
        if (liveUser?.socketId) {
          io.to(liveUser.socketId).emit("newPrescription", createdPrescription);
        }
        return res
          .status(201)
          .json({ message: "Prescription has been assigned successfully" });
      })
      .catch((err) => { //catchs errors from MongoDB level
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
export async function deletePrescription(req: Request, res: Response) {
  const {id}=req.params
  if(!isValidObjectId(id)) return res.status(400).json({message:"invalid id for prescription"})
  const { USER_ID } = req.body;
  if (!isValidObjectId(USER_ID)) return res.status(400).json({ message: "Invalid user id" });
  await Prescription.deleteOne({_id:id}).then(()=>{
    return res.status(204).json({message:"prescription deleted successfully from DB"})
  }).catch(()=>{
    return res.status(400).json({message:"error occured while trying to delete the prescription"})
  })
}
