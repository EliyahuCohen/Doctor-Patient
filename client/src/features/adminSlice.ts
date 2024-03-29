import { createSlice } from "@reduxjs/toolkit";
import { User } from "../types/type";

export interface adminUsers {
  users: User[];
  liveUsers: any[];//live users' id
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

    setLiveUsers: (state: adminUsers, action) => {
      state.liveUsers = action.payload;
    },
    addStateLive: (state: adminUsers, action: { payload: { _id: string } }) => {
      const { _id } = action.payload;
      for (let i = 0; i < state.users.length; i++) {
        if (state.users[i]._id == _id) {
          state.users[i].live = true;
          break;
        }
      }
    },
    updateLiveUsers: (state: adminUsers) => {
      state.users.forEach((user) => {
        for(let i=0;i<state.liveUsers.length;i++)
        {
          if (user._id == state.liveUsers[i]) {
            user.live = true;
            break;
          }
        }
      });
    },
    addNewUser: (state: adminUsers, action) => {
      state.users.push(action.payload.user);
      state.users[state.users.length - 1].live = true;
      state.liveUsers.push(action.payload.user._id);
    },
    removeLiveUser: (state: adminUsers, action) => {
      for (let i = 0; i < state.users.length; i++) {
        if (state.users[i]._id == action.payload) {
          state.users[i].live = false;
          break;
        }
      }
    },
    //maps over the live users from the DB to extract their user_id
    setLiveUsersObject: (state: adminUsers, action) => {
      const arr: any[] = [];
      action.payload.forEach((el: any) => {
        arr.push(el.userId);
      });
      state.liveUsers = arr;
    },
  },
});
export const {
  setAdminUsers,
  setLiveUsers,
  updateLiveUsers,
  addStateLive,
  removeLiveUser,
  addNewUser,
  setLiveUsersObject,
} = adminSlice.actions;
export default adminSlice.reducer;
