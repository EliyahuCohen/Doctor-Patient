import axios from "axios";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { IMessage } from "../pages/CommunicationPage/Communication";
export function useMessages(
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
) {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  function getConversation(personId: string) {
    instance.get(`http://localhost:3002/messages/${personId}`).then((res) => {
      setMessages(res.data.messages);
    });
  }
  function sendNewMessage(message: string, personId: string) {
    instance
      .post("http://localhost:3002/messages/message", { message, personId })
      .then((res) => {
        const date = new Date();
        setMessages((prev) => [...prev, res.data]);
      });
  }
  return { getConversation, sendNewMessage };
}
