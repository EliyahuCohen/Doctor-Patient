import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/type";

export interface adminUsers {
  users: User[];
  liveUsers: any[];
}

const initialState: adminUsers = {
  users: [],
  liveUsers: [],
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminUsers: (state: adminUsers, action) => {
      state.users = action.payload;
    },
    updateStateLive: (state: adminUsers, action) => {
      const { _id } = action.payload;
      for (let i = 0; i < state.users.length; i++) {
        if (state.users[i]._id == _id) {
          state.users[i].live = true;
          break;
        }
      }
    },

    setLiveUsers: (state: adminUsers, action) => {
      state.liveUsers = action.payload;
    },
    setLiveUsersObject: (state: adminUsers, action) => {
      const arr: any[] = [];
      action.payload.forEach((el: any) => {
        arr.push(el.userId);
      });
      state.liveUsers = arr;
    },
    updateLiveUsers: (state: adminUsers) => {
      state.users.forEach((user) => {
        state.liveUsers.forEach((live) => {
          if (user._id == live) {
            user.live = true;
          }
        });
      });
    },
    removeLiveUser: (state: adminUsers, action) => {
      console.log(action.payload);
      for (let i = 0; i < state.users.length; i++) {
        console.log(state.users[i]._id);
        if (state.users[i]._id == action.payload) {
          state.users[i].live = false;
          break;
        }
      }
    },
  },
});
export const {
  setAdminUsers,
  setLiveUsers,
  updateLiveUsers,
  updateStateLive,
  setLiveUsersObject,
  removeLiveUser,
} = adminSlice.actions;
export default adminSlice.reducer;
