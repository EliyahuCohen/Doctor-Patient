import { Register } from "../types/type";
import axios from "axios";
import React from "react";

export function useRegister(
  prop: Register,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  async function registerFunc() {
    return await axios
      .post("http://localhost:3001/users/signup", prop)
      .then((res) => {
        setError("");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }
  return { registerFunc };
}
