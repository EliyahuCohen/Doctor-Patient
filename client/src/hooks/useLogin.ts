import { Login } from "../types/type";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import { socket } from "../pages/Admin/AdminPage";
import { setLiveUsers } from "../features/adminSlice";

export function useLogin(
  prop: Login,
  setMyError: React.Dispatch<React.SetStateAction<string>>
) {
  const dispatch = useDispatch();
  async function loginFunc() {
    return await axios
      .post("http://localhost:3001/users/login", prop)
      .then((res) => {
        setMyError(() => "");
        dispatch(setUser(res.data));
        if (res.data.user.role == 0) {
          dispatch(setLiveUsers(res.data.usersId));
        }
        socket.emit("userConnected", res.data.user);
      })
      .catch((err) => {
        console.log("error", err.response.data.message);
        setMyError(() => err.response.data.message);
      });
  }
  return { loginFunc };
}
