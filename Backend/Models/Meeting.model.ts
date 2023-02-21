import mongoose, { Schema, Types } from "mongoose";

const { ObjectId } = mongoose.Types;
export interface Meet {
  title: String;
  time: Date;
  doctorID: typeof ObjectId;
  patientID: typeof ObjectId;
}

const meetingSchema: Schema = new mongoose.Schema<Meet>(
  {
    title: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    doctorID: {
      type: Types.ObjectId,
      required: true,
    },
    patientID: {
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<Meet>("meeting", meetingSchema);
