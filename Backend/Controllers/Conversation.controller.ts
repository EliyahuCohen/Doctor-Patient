import Conversation, { IMessage } from "../Models/Conversation.model";
import { Request, Response } from "express";
import { IConversation } from "../Models/Conversation.model";
import mongoose from "mongoose";
import { io } from "../server";
import { usersID } from "../socket";
import User from "../Models/User.model";

interface Req {
  USER_ID: mongoose.Types.ObjectId;
  personId: mongoose.Types.ObjectId;
}
export interface ReqMessage {
  USER_ID: mongoose.Types.ObjectId;
  personId: mongoose.Types.ObjectId;
  message: string;
}

//get
export async function getConversation(req: Request, res: Response) {
  const { USER_ID } = req.body as Req;
  const { personId } = req.params;
  //checking for existing conversation between the two
  const isInDoctorsList = await User.findById(USER_ID);
  if (!isInDoctorsList) return res.status(404).json({ message: "No a Person" });
  let status: Boolean = false;
  for (let i = 0; i < isInDoctorsList.listOfDoctors.length; i++) {
    if (isInDoctorsList.listOfDoctors[i] == (personId as any)) {
      status = true;
      break;
    }
  }
  for (let i = 0; i < isInDoctorsList.listOfPatients.length; i++) {
    if (isInDoctorsList.listOfPatients[i] == (personId as any)) {
      status = true;
      break;
    }
  }
  if (!status) return res.status(404).json({ message: "Not in doctors list" });
  const conversationExists: IConversation | null = await Conversation.findOne({
    participants: { $all: [USER_ID, personId] },
  });
  if (conversationExists) {
    conversationExists.messages.forEach((message) => {
      message.read = true;
    });
    await (conversationExists as any).save();
    return res.status(200).json(conversationExists);
  } else {
    //creating a new conversation between two of these people
    const newConversation = await Conversation.create({
      messages: [],
      participants: [USER_ID, personId],
    });
    res.status(201).json(newConversation);
  }
}
//post
export async function PostNewMessage(req: Request, res: Response) {
  const { USER_ID, message, personId } = req.body as ReqMessage;
  const conversation = await Conversation.findOne({
    participants: {
      $all: [USER_ID, personId],
    },
  });
  if (!conversation) {
    return res.status(404).json({ message: "There is no such conversation" });
  }
  const date = new Date();
  conversation.messages.push({
    sender: USER_ID as any,
    message,
    createdAt: date,
    read: false,
  });
  const otherUser = usersID.filter((one) => one.userId == personId)[0];
  if (otherUser) {
    let senderName: string = await User.findById(USER_ID).then(
      (res) => res?.fName + " " + res?.lName!
    );
    io.to(otherUser.socketId).emit("messageSent", {
      message,
      createdAt: date,
      senderName: senderName,
      type: "MESSAGE",
      time: 2000,
      senderId: USER_ID,
    });
  }
  await conversation.save();

  return res
    .status(201)
    .json({ sender: USER_ID, message, createdAt: date, read: false });
}
