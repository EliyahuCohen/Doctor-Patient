import mongoose, { Schema, Types } from "mongoose";

const { ObjectId } = mongoose.Types;
export interface IMeet {
  date: Date;
  startTime: number;
  endTime: number;
  doctorId: typeof ObjectId;
  patientId: typeof ObjectId;
  patientName: string;
  doctorName: string;
  completed: boolean;
}

const meetingSchema: Schema = new mongoose.Schema<IMeet>(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime: {
      type: Number,
      required: true,
    },
    doctorId: {
      type: Types.ObjectId,
      required: true,
    },
    patientId: {
      type: Types.ObjectId,
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IMeet>("meeting", meetingSchema);
