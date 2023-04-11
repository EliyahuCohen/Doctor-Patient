import mongoose, { ObjectId, Schema } from "mongoose";

export interface IMessage {
  sender: ObjectId;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface IConversation {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
}

export const messageSchema: Schema = new mongoose.Schema<IMessage>({
  sender: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export const ConversationSchema = new mongoose.Schema<IConversation>(
  {
    participants: {
      type: [mongoose.Types.ObjectId],
      required: true,
    },
    messages: {
      type: [messageSchema],
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
