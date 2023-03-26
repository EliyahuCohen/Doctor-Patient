import mongoose, { Schema, Types } from "mongoose";

export interface ISystemMessage {
  message: string;
  type: 1 | 2 | 3;
}
export interface ITimeSpan {
  startTime: number;
  endTime: number;
}

export interface Schedule {
  day: 1 | 2 | 3 | 4 | 5 | 6;
  times: [ITimeSpan];
}

export interface User {
  fName: string;
  lName: string;
  password: string;
  email: string;
  role: number;
  approved: boolean;
  meetingAmount: number;
  listOfDoctors: Types.ObjectId[];
  listOfPatients: Types.ObjectId[];
  messages: ISystemMessage[];
  speciality: string;
  meetings: Types.ObjectId[];
  location: string;
  isMale: boolean;
  schedule: Schedule[];
}

const scheduleSchema: Schema = new mongoose.Schema<Schedule>(
  {
    day: { type: Number, required: true },
    times: { type: [Object], required: false, default: [] },
  },
  { _id: false }
);

const userSchema: Schema = new mongoose.Schema<User>(
  {
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    isMale: { type: Boolean, required: true, default: true },
    location: { type: String, required: true },
    speciality: { type: String, required: false },
    role: { type: Number, required: true, default: 2 },
    approved: { type: Boolean, required: false, default: false },
    meetingAmount: { type: Number, required: false, default: 0 },
    listOfDoctors: {
      type: [Types.ObjectId],
      default: [],
      required: false,
    },
    listOfPatients: {
      type: [Types.ObjectId],
      default: [],
      required: false,
    },
    meetings: {
      type: [Types.ObjectId],
      default: [],
      required: false,
    },
    messages: {
      type: [Object],
      required: false,
      default: [],
    },
    schedule: {
      type: [scheduleSchema],
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<User>("user", userSchema);
