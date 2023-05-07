import mongoose, { ObjectId } from "mongoose";

export interface IRating {
  feedback: string;
  rating: number;
  userName: string;
  doctorId: ObjectId;
}

export const RatingSchema = new mongoose.Schema<IRating>(
  {
    feedback: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    doctorId: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRating>("rating", RatingSchema);
