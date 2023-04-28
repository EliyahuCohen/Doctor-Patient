import { User } from "../types/type";
import axios from "axios";
import { useEffect } from "react";
export function useGetUserDoctorPatients(
  setDoctors: React.Dispatch<React.SetStateAction<User[]>>,
  setPatients: React.Dispatch<React.SetStateAction<User[]>>,
  token: string | null
) {
  function getInfo() {
    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .get("https://doctor-patient-api.onrender.com/users/users")
      .then((res) => {
        setDoctors(res.data.doctorsArray);
        setPatients(res.data.patientsArray);
      });
  }

  useEffect(() => {
    getInfo();
  }, []);
}
