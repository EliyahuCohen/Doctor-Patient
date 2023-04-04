import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { newMessage } from "../features/messagesSlice";

export function useMeetings() {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const dispatch = useDispatch();
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  async function postMeeting(
    date: Date,
    doctorId: any,
    endTime: number,
    startTime: number
  ) {
    instance
      .post("http://localhost:3001/meeting/meet", {
        date,
        doctorId,
        endTime,
        startTime,
      })
      .then((res) => {
        //saying somthing or saving
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Meetings schedualed",
            senderName: "System",
            type: "MESSAGE",
            time: 3000,
            senderId: crypto.randomUUID(),
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return { postMeeting };
}
