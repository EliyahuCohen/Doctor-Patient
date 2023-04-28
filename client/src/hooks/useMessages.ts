import axios from "axios";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { IMessage } from "../pages/CommunicationPage/Communication";
import { useNavigate } from "react-router-dom";
import sendmessage from "../assets/sendmessage.mp3";
export function useMessages(
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
) {
  const navigate = useNavigate();
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  function getConversation(personId: string) {
    instance
      .get(`https://doctor-patient-api.onrender.com/messages/${personId}`)
      .then((res) => {
        setMessages(res.data.messages);
      })
      .catch((err) => navigate("/dashboard"));
  }
  function sendNewMessage(message: string, personId: string) {
    instance
      .post("https://doctor-patient-api.onrender.com/messages/message", {
        message,
        personId,
      })
      .then((res) => {
        new Audio(sendmessage).play();
        const date = new Date();
        setMessages((prev) => [...prev, res.data]);
      });
  }
  return { getConversation, sendNewMessage };
}
