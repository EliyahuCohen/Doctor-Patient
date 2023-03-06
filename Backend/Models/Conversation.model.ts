import mongoose from "mongoose";

export interface IMessage {
  sender: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
  read: number;
}

export interface IConversation {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
}

export const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: {
      type: [mongoose.Types.ObjectId],
      required: true,
    },
    messages: {
      type: [Object],
      required: false,
      default: [],
    },
  },
  { timestamps: true }
);
export default mongoose.model<IConversation>(
  "conversation",
  ConversationSchema
);
