import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { User } from "../types/type";

export function useGetAllDoctors(
  setDoctors: React.Dispatch<React.SetStateAction<User[] | null>>,
  setSpecialities: React.Dispatch<React.SetStateAction<string[]>>
) {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  async function getDoctors() {
    instance
      .get("http://localhost:3001/users/doctors")
      .then((res) => {
        setDoctors(res.data);
        setSpecialities([
          ...new Set(res.data.map((one: User) => one.speciality)),
        ] as string[]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return { getDoctors };
}
