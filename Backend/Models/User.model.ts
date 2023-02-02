import mongoose, { Schema, Types } from "mongoose";

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
  speciality: string;
  mettings: Types.ObjectId[];
  location: string;
  isMale: boolean;
}

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
    mettings: {
      type: [Types.ObjectId],
      default: [],
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<User>("user", userSchema);
