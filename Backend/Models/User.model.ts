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
export interface IMeetingsDuration {
  meetingsAmount: number;
  totalDuration: number;
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
  meetingsDoctors: Types.ObjectId[];
  meetingsPatients: Types.ObjectId[];
  location: string;
  isMale: boolean;
  schedule: Schedule[];
  userRating: IRating;
  varificationCode: string;
  Duration: IMeetingsDuration;
}
export interface IRating {
  sum: number;
  votes: number;
}

const messageSchema: Schema = new mongoose.Schema<ISystemMessage>(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
const userRating: Schema = new mongoose.Schema<IRating>({
  sum: {
    type: Number,
    required: false,
  },
  votes: {
    type: Number,
    default: 0,
  },
});
const MeetingsDuration: Schema = new mongoose.Schema<IMeetingsDuration>({
  meetingsAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  totalDuration: {
    type: Number,
    default: 0,
  },
});

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
    meetingsDoctors: {
      type: [Types.ObjectId],
      default: [],
      required: false,
    },
    meetingsPatients: {
      type: [Types.ObjectId],
      default: [],
      required: false,
    },
    messages: {
      type: [messageSchema],
      required: false,
      default: [],
    },
    schedule: {
      type: [scheduleSchema],
      required: false,
      default: [],
    },
    userRating: {
      type: userRating,
      default: { sum: 0, votes: 0 },
      required: false,
    },
    varificationCode: {
      type: String,
      default: "",
      required: false,
    },
    Duration: {
      type: MeetingsDuration,
      default: { meetingsAmount: 0, totalDuration: 0 },
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<User>("user", userSchema);
