import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { newMessage } from "../features/messagesSlice";
import { UserType } from "../features/userSlice";
import { User } from "../types/type";

export function useUpdateRole(userId: string) {
  const dispatch = useDispatch();
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  async function updateRole(
    setUser: React.Dispatch<React.SetStateAction<User | null>>
  ) {
    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .patch(`http://localhost:3001/users/updateRole/${userId}`)
      .then(function (res) {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Role was updated!",
            senderName: "System",
            time: 3000,
            type: "SYSTEM",
            senderId: crypto.randomUUID(),
          })
        );
        setUser((prev) => {
          return { ...prev, approved: !prev?.approved } as User;
        });
      })
      .catch((err) => {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Role updated Faild!",
            senderName: "System",
            time: 3000,
            type: "DELETE",
            senderId: crypto.randomUUID(),
          })
        );
        console.log(err);
      });
  }
  return { updateRole };
}
