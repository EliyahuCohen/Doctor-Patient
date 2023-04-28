import { Register } from "../types/type";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

export function useRegister(
  prop: Register,
  setError: React.Dispatch<React.SetStateAction<string>>
) {
  const navigate = useNavigate();
  async function registerFunc() {
    if (prop.role == 1 && prop.speciality == "") {
      prop.speciality = "family-doctor";
    }
    return await axios
      .post("https://doctor-patient-api.onrender.com/users/signup", prop)
      .then((res) => {
        setError("");
        navigate("/signin");
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }
  return { registerFunc };
}
