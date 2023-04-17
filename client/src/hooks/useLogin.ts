import { Login } from "../types/type";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";
import { socket } from "../App";
import { setLiveUsers } from "../features/adminSlice";
import { useSaveLocalStorage } from "./useSaveLocalStorage";

export function useLogin(
  prop: Login,
  setMyError: React.Dispatch<React.SetStateAction<string>>
) {
  const { saveLocalStorage } = useSaveLocalStorage();
  const dispatch = useDispatch();
  async function loginFunc(navigate: any) {
    try {
      const res = await axios.post("http://localhost:3001/users/login", prop);
      setMyError(() => "");
      dispatch(setUser(res.data));
      localStorage.setItem("user", JSON.stringify(res.data));
      if (res?.data?.user?.role === 0) {
        dispatch(setLiveUsers(res.data.usersId));
      }
      saveLocalStorage(res.data);
      navigate("/dahsboard");
      socket.emit("userConnected", res.data.user);
    } catch (err: any) {
      console.log("error", err);
      setMyError(() => err?.response?.data?.message);
    }
  }

  return { loginFunc };
}
