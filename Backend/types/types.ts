import { Schedule } from "../Models/User.model";
import mongoose from "mongoose";

export class SendMessage {
  message: string;
  createdAt: Date;
  senderName: string;
  type: "MESSAGE" | "SYSTEM" | "DELETE ";
  time: 2000 | 3000 | 4000 | 5000;
  constructor(
    message: string,
    createdAt: Date,
    senderName: string,
    type: "MESSAGE" | "SYSTEM" | "DELETE ",
    time: 2000 | 3000 | 4000 | 5000
  ) {
    this.message = message;
    this.createdAt = createdAt;
    this.senderName = senderName;
    this.type = type;
    this.time = time;
  }
}
export interface ScheduleDay {
  schedule: Schedule;
  day: string; //from 0-6
}
export interface IQuote {
  id: number;
  quote: string;
}
export interface IUserStats {
  meetingAmount: number;
  rating: number;
  doctorsAmount: number;
  patientsAmount: number;
}
export interface user {
  userId: mongoose.Types.ObjectId;
  socketId: string;
}
