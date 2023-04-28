import axios from "axios";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { IAlert } from "../types/type";

export function useGetSystemMessages(
  setMessages: React.Dispatch<React.SetStateAction<IAlert[]>>
) {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  function getSystemMessages() {
    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .get("http://localhost:3001/users/getMessages")
      .then((res) => {
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getSystemMessages();
  }, []);
}
