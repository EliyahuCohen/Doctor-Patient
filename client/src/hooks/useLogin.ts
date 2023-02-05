import { Login } from "../types/type";
import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

export function useLogin(
  prop: Login,
  setMyError: React.Dispatch<React.SetStateAction<string>>
) {
  const dispatch = useDispatch();
  async function loginFunc() {
    return await axios
      .post("http://localhost:3002/users/login", prop)
      .then((res) => {
        setMyError(() => "");
        dispatch(setUser(res.data));
      })
      .catch((err) => {
        console.log("error", err.response.data.message);
        setMyError(() => err.response.data.message);
      });
  }
  return { loginFunc };
}
