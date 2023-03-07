import axios from "axios";
import { useSelector } from "react-redux";
import { setUser, UserType } from "../features/userSlice";
import { User } from "../types/type";

export function useUpdateRole(userId: string) {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  async function updateRole(
    user: React.Dispatch<React.SetStateAction<User | null>>
  ) {
    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .patch(`http://localhost:3001/users/updateRole/${userId}`)
      .then((res) => {
        setUser((prev: User) => {
          return { ...prev, approved: !prev.approved };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return { updateRole };
}
