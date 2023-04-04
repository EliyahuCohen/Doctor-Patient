import mongoose, { Schema, Types } from "mongoose";

const { ObjectId } = mongoose.Types;
export interface Meet {
  date: Date;
  startTime: number;
  endTime: number;
  doctorId: typeof ObjectId;
  patientId: typeof ObjectId;
}

const meetingSchema: Schema = new mongoose.Schema<Meet>(
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
  },
  { timestamps: true }
);

export default mongoose.model<Meet>("meeting", meetingSchema);
