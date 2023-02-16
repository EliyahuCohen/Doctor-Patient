import axios from "axios";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { User } from "../types/type";

export function useGetOneUser(
  id: string,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
) {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  function getUser() {
    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .get(`http://localhost:3001/users/one/${id}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return { getUser };
}
