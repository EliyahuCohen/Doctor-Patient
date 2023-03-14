import { createSlice } from "@reduxjs/toolkit";
import { IMessage } from "../types/type";

export interface messagesType {
  messages: IMessage[];
}

const initialState: messagesType = {
  messages: [],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    newMessage: (state: messagesType, action: { payload: IMessage }) => {
      if (state.messages.length > 2) {
        state.messages.splice(0, 1);
      }
      state.messages.push(action.payload);
    },
    deleteMessage: (state, action: { payload: string }) => {
      state.messages.splice(
        state.messages.findIndex((mess) => mess.id == action.payload),
        1
      );
    },
  },
});
export const { newMessage, deleteMessage } = messageSlice.actions;
export default messageSlice.reducer;
