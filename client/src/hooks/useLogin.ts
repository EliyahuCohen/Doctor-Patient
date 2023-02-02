import { Login } from "../types/type";
import axios from "axios";
import React from "react";

export function useLogin(
  prop: Login,
  setMyError: React.Dispatch<React.SetStateAction<string>>
) {
  async function loginFunc() {
    return await axios
      .post("http://localhost:3001/users/login", prop)
      .then((res) => {
        setMyError(() => "");
      })
      .catch((err) => {
        console.log("error", err.response.data.message);
        setMyError(() => err.response.data.message);
      });
  }
  return { loginFunc };
}
