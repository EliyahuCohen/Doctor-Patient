import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { newMessage } from "../features/messagesSlice";
import { UserType, updateUserInfo } from "../features/userSlice";
import { User } from "../types/type";

export function useUpdateRole(userId: string) {
  const dispatch = useDispatch();
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  async function updateRole(
    setUser: React.Dispatch<React.SetStateAction<User | null>>
  ) {
    instance
      .patch(
        `https://doctor-patient-api.onrender.com/users/updateRole/${userId}`
      )
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
  async function updateUser(user: User) {
    instance
      .patch(`https://doctor-patient-api.onrender.com/users/update/${userId}`, {
        user,
      })
      .then((res) => {
        dispatch(updateUserInfo(res.data));
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Personal information was updated ",
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 3000,
            type: "MESSAGE",
          })
        );
      })
      .catch((err) => console.log(err.response));
  }
  async function updateUserDoctorsList(docId: string) {
    instance
      .patch(
        `https://doctor-patient-api.onrender.com/users/updateDoctors/${docId}`
      )
      .then((res) => {
        dispatch(updateUserInfo(res.data));
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Doctor's List Updated ",
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 3000,
            type: "MESSAGE",
          })
        );
      })
      .catch((err) => console.log(err.response));
  }
  return { updateRole, updateUser, updateUserDoctorsList };
}
