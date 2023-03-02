import Conversation from "../Models/Conversation.model";
import { Request, Response } from "express";
import { IConversation } from "../Models/Conversation.model";
import mongoose from "mongoose";
import { io, user, usersID } from "../server";

interface Req {
  USER_ID: mongoose.Types.ObjectId;
  personId: mongoose.Types.ObjectId;
}

interface ReqMessage {
  USER_ID: mongoose.Types.ObjectId;
  personId: mongoose.Types.ObjectId;
  message: string;
}

export async function getConversation(req: Request, res: Response) {
  const { USER_ID } = req.body as Req;
  const { personId } = req.params;
  //checking for existing conversation between the two
  const conversationExists: IConversation | null = await Conversation.findOne({
    participants: { $all: [USER_ID, personId] },
  });
  if (conversationExists) {
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
  conversation.messages.push({ sender: USER_ID, message, createdAt: date });
  await conversation.save();
  const specificUser = usersID.filter((one) => one.userId == personId)[0];
  if (specificUser) {
    io.to(specificUser.socketId).emit("messageSent", {
      sender: USER_ID,
      message,
      createdAt: date,
    });
  }
  return res.status(201).json({ sender: USER_ID, message, createdAt: date });
}
