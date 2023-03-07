import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import adminSlice from "./features/adminSlice";
import messagesSlice from "./features/messagesSlice";

export const store = configureStore({
  reducer: {
    userSlice,
    adminSlice,
    messagesSlice,
  },
});
