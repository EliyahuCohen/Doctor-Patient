import axios from "axios";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { useDispatch } from "react-redux";
import { updateDoctorList } from "../features/userSlice";
import { newMessage } from "../features/messagesSlice";
export function useUpdateDoctorList() {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const dispatch = useDispatch();
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  async function updateList(doctorId: string) {
    instance
      .patch(
        `https://doctor-patient-api.onrender.com/users/updateDoctors/${doctorId}`
      )
      .then((res) => {
        const date = new Date();
        dispatch(updateDoctorList(doctorId));
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Doctors List Updated",
            senderId: crypto.randomUUID(),
            senderName: "",
            time: 3000,
            type: "SYSTEM",
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return { updateList };
}
