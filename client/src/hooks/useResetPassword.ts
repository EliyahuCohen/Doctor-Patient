import { useDispatch } from "react-redux";
import axios from "axios";
import { newMessage } from "../features/messagesSlice";
export function useResetPassword(
  setStage: React.Dispatch<React.SetStateAction<1 | 2 | 3 | 4>>
) {
  const dispatch = useDispatch();

  async function sendEmail(email: string) {
    axios
      .post("http://localhost:3001/users/reset-password", { email })
      .then((res) => {
        setStage((prev) => (prev + 1) as 1 | 2 | 3 | 4);
      })
      .catch((err) => console.log(err));
  }
  async function sendEmailAgain(email: string) {
    axios
      .post("http://localhost:3001/users/reset-password", { email })
      .catch((err) => console.log(err));
  }
  async function ValidateVerficationCode(email: string, code: string) {
    axios
      .post("http://localhost:3001/users/verification", { email, code })
      .then((res) => {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: res.data.message,
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 2000,
            type: "MESSAGE",
          })
        );
        setTimeout(() => {
          setStage((prev) => (prev + 1) as 1 | 2 | 3 | 4);
        }, 2000);
      })
      .catch((err) => {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: err.response.data.message,
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 4000,
            type: "DELETE",
          })
        );
      });
  }
  async function resetPassword(email: string, password: string) {
    axios
      .post("http://localhost:3001/users/change-password", { email, password })
      .then((res) => {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: res.data.message,
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 2000,
            type: "MESSAGE",
          })
        );
      })
      .catch((err) => {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Can't change the password at the moment",
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 3000,
            type: "DELETE",
          })
        );
      });
  }
  return { sendEmail, sendEmailAgain, ValidateVerficationCode, resetPassword };
}
