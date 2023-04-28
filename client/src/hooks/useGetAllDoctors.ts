import axios from "axios";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { User } from "../types/type";

export function useGetAllDoctors(
  setDoctors: React.Dispatch<React.SetStateAction<User[] | null>>
) {
  const { token, user: TheUser } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  async function getDoctors(
    doctors: User[],
    setIsFetched: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    const ids: string[] = doctors.map((u) => u._id);
    instance
      .get("https://doctor-patient-api.onrender.com/users/doctors")
      .then((res) => {
        setIsFetched(true);
        let arr: User[] = res.data;
        const a = arr.filter(
          (user) => user._id != TheUser?._id && !ids.includes(user._id)
        );
        if (a.length > 0) {
          setDoctors(a);
        } else {
          setDoctors(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return { getDoctors };
}
