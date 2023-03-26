import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newMessage } from "../features/messagesSlice";
import { UserType } from "../features/userSlice";
import { ScheduleDay } from "../types/type";
export function useSchedual(
  setDaysList: React.Dispatch<React.SetStateAction<ScheduleDay[]>>,
  daysList: ScheduleDay[]
) {
  const dispatch = useDispatch();
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  async function postSchedual(weeklySchedual: ScheduleDay[]) {
    instance
      .post("http://localhost:3001/users/schdeual", { weeklySchedual })
      .then(() => {
        console.log("updated");
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Hours list updated",
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 3000,
            type: "MESSAGE",
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function getSchedual() {
    instance
      .get("http://localhost:3001/users/schdeual")
      .then((res) => {
        console.log("get");
        if (res.data.schedual.length == 0) return;
        const sc = res.data.schedual;
        sc.forEach((element: ScheduleDay, index: number) => {
          element.day = daysList[index].day;
        });
        setDaysList(sc);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getSchedual();
  }, []);
  return { postSchedual };
}
