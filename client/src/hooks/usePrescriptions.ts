import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { IPrescription } from "../types/type";
import { newMessage } from "../features/messagesSlice";
export function usePrescriptions() {
  const { user, token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const dispatch = useDispatch();
  const instance = axios.create({
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  async function getPrescriptions(
    setPrescriptions: React.Dispatch<
      React.SetStateAction<IPrescription[] | null>
    >
  ) {
    instance
      .get("http://localhost:3001/prescriptions/prescriptions")
      .then((res) => setPrescriptions(res.data))
      .catch((err) => console.log(err));
  }
  async function submitPrescription(data: IPrescription) {
    instance
      .post("http://localhost:3001/prescriptions/new-prescription", { ...data })
      .then((res) => {
        console.log(res.data);
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: res.data.message,
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 3000,
            type: "MESSAGE",
          })
        );
      })
      .catch((err) => {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Prescription Faild",
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 3000,
            type: "DELETE",
          })
        );
      });
  }
  return { getPrescriptions, submitPrescription };
}
