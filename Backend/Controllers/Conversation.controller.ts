import Conversation, { IMessage } from "../Models/Conversation.model";
import { Request, Response } from "express";
import { IConversation } from "../Models/Conversation.model";
import mongoose from "mongoose";
import { io } from "../server";
import { usersID } from "../socket";
import User from "../Models/User.model";

interface ReqObjectIDs {
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
  const { USER_ID } = req.body as ReqObjectIDs;
  const { personId } = req.params;
  //checking for existing conversation between the two
  const user = await User.findById(USER_ID);
  if (!user) return res.status(404).json({ message: "user does not exist" });
  let status: Boolean = false;
  //checking that the user is a patient and the personId is the doctor
  for (let i = 0; i < user.listOfDoctors.length; i++) {
    if (user.listOfDoctors[i] == (personId as any)) {
      status = true;
      break;
    }
  }
  //checking that the user is a doctor and the personId is the patient
  for (let i = 0; i < user.listOfPatients.length; i++) {
    if (user.listOfPatients[i] == (personId as any)) {
      status = true;
      break;
    }
  }
  if (!status)
    return res
      .status(404)
      .json({ message: "Connection between the two does not exist" });
  const conversationExists: IConversation | null = await Conversation.findOne({
    participants: { $all: [USER_ID, personId] },
  });
  if (conversationExists) {
    conversationExists.messages.forEach((message) => {
      message.read = true;
    });
    await (conversationExists as any).save(); // save the messages as read
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
  //check if the recipient is online
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
