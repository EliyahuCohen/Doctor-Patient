import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newMessage } from "../features/messagesSlice";
import { UserType } from "../features/userSlice";
import { Schedule, ScheduleDay } from "../types/type";
export function useSchedual() {
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
      .then(() => {})
      .catch((err) => {
        newMessage({
          id: crypto.randomUUID(),
          message: "Could not save the changes at this time",
          senderId: crypto.randomUUID(),
          senderName: "System",
          time: 7000,
          type: "DELETE",
        });
      });
  }
  async function getSchedual(
    setDaysList: React.Dispatch<React.SetStateAction<ScheduleDay[]>>,
    daysList: ScheduleDay[]
  ) {
    instance
      .get("http://localhost:3001/users/schdeual")
      .then((res) => {
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
  async function getMeetings(
    date: Date,
    doctorId: string,
    day: number,
    setAvailableMeetings: React.Dispatch<React.SetStateAction<Schedule | null>>,
    setError: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    instance
      .post(`http://localhost:3001/meeting/get-meetings/${doctorId}`, {
        date,
        day,
      })
      .then((res) => {
        setLoading(false);
        setError(false);
        setAvailableMeetings(res.data);
      })
      .catch((err) => {
        setError(true);
      });
  }
  return { postSchedual, getMeetings, getSchedual };
}
