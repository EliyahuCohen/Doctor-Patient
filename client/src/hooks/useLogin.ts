import { Login } from "../types/type";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserType, setUser } from "../features/userSlice";
import { socket } from "../App";
import { setLiveUsers } from "../features/adminSlice";
import { useSaveLocalStorage } from "./useSaveLocalStorage";
import { logout } from "../features/userSlice";

export function useLogin() {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const { saveLocalStorage } = useSaveLocalStorage();
  const dispatch = useDispatch();
  async function loginFunc(
    prop: Login,
    setMyError: React.Dispatch<React.SetStateAction<string>>
  ) {
    try {
      const res = await axios.post("http://localhost:3001/users/login", prop);
      if (res.status == 200) {
        setMyError(() => "");
        dispatch(setUser(res.data));
        if (res?.data?.user?.role === 0) {
          dispatch(setLiveUsers(res.data.usersId));
        }
        saveLocalStorage(res.data);
        socket.emit("userConnected", res.data.user);
        return res.data;
      } else {
        setMyError(() => "The Server Is Not On");
      }
    } catch (err: any) {
      setMyError(() => err?.response?.data?.message);
    }
  }
  async function checkTokenValidity() {
    if (token) {
      const instance = axios.create({
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      instance.get("http://localhost:3001/users/checkAccess").catch(() => {
        dispatch(logout());
        saveLocalStorage({ token: null, user: null });
      });
    }
  }

  return { loginFunc, checkTokenValidity };
}
