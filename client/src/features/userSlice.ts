import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/type";

export interface UserType {
  token: string | null;
  user: User | null;
}

const initialState: UserType = {
  token:
    (JSON.parse(localStorage.getItem("user")!) &&
      JSON.parse(localStorage.getItem("user")!).token) ||
    null,
  user:
    (JSON.parse(localStorage.getItem("user")!) &&
      JSON.parse(localStorage.getItem("user")!).user) ||
    null,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: UserType, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    updateUserInfo: (state: UserType, action) => {
      state.user = action.payload;
    },
    updateMeetingAmount: (state: UserType, action: any) => {
      state.user!.meetingAmount++;
    },
    logout: (state) => {
      localStorage.setItem("user", JSON.stringify(null));
      state.token = null;
      state.user = null;
    },
    updateDoctorList: (state: UserType, action: { payload: string }) => {
      if (state.user?.listOfDoctors.includes(action.payload)) {
        state.user?.listOfDoctors.splice(
          state.user.listOfDoctors.findIndex((mess) => mess == action.payload),
          1
        );
      } else {
        state.user?.listOfDoctors.push(action.payload);
      }
      localStorage.setItem("user", JSON.stringify(state));
    },
    updateRole: (state: UserType, action: { payload: boolean }) => {
      if (state.user) {
        state.user.approved = action.payload;
        localStorage.setItem("user", JSON.stringify(state));
      }
    },
  },
});
export const {
  setUser,
  logout,
  updateMeetingAmount,
  updateDoctorList,
  updateRole,
  updateUserInfo,
} = userSlice.actions;
export default userSlice.reducer;
