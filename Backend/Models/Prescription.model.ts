import mongoose, { ObjectId, Schema } from "mongoose";

export interface IMedication {
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
}

export interface IPrescription {
  doctorId: ObjectId;
  patinetId: ObjectId;
  doctorName: string;
  medications: IMedication[];
  endDate: Date;
  title: string;
}

export const medicationSchema = new Schema<IMedication>({
  name: {
    required: true,
    type: String,
  },
  dosage: {
    required: true,
    type: String,
  },
  frequency: {
    required: true,
    type: String,
  },
  instructions: {
    required: false,
    default:"No additional instructions",
    type: String,
  },
});
export const prescriptionSchema = new Schema<IPrescription>({
  doctorId: {
    required: true,
    type: String,
  },
  patinetId: {
    required: true,
    type: String,
  },
  medications: {
    required: true,
    type: [medicationSchema],
  },
  doctorName: {
    required: true,
    type: String,
  },
  endDate: {
    required: true,
    type: Date,
  },
  title: {
    required: true,
    type: String,
  },
});
export default mongoose.model("prescription", prescriptionSchema);
