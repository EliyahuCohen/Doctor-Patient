import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/type";

export interface UserType {
  token: string | null;
  user: User | null;
}

const initialState: UserType = {
  token: JSON.parse(localStorage.getItem("user")!).token||null,
  user: JSON.parse(localStorage.getItem("user")!).user||null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: UserType, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
