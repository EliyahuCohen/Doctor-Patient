import { Register } from "../types/type";
import axios from "axios";
import React from "react";
import { setUser } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { socket } from "../App";

export function useRegister(
  prop: Register,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  const dispatch = useDispatch();
  async function registerFunc() {
    return await axios
      .post("http://localhost:3002/users/signup", prop)
      .then((res) => {
        setError("");
        socket.emit("newUser", res.data.user._id);
        dispatch(setUser(res.data));
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }
  return { registerFunc };
}
