import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { newMessage } from "../features/messagesSlice";
import { IMeet, IUserStats } from "../types/type";

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
  async function getOneMeeting(
    id: string,
    setMeeting: React.Dispatch<React.SetStateAction<IMeet | null>>
  ) {
    instance
      .get(`http://localhost:3001/meeting/get-one-meeting/${id}`)
      .then((res) => setMeeting(res.data))
      .catch((err) => console.log(err));
  }
  async function postMeeting(
    date: Date,
    doctorId: any,
    endTime: number,
    startTime: number,
    bookUI: () => void
  ) {
    instance
      .post("http://localhost:3001/meeting/meet", {
        date,
        doctorId,
        endTime,
        startTime,
      })
      .then((res) => {
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
        bookUI();
      })
      .catch((err) => {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: err.response.data.message,
            senderName: "System",
            type: "DELETE",
            time: 3000,
            senderId: crypto.randomUUID(),
          })
        );
      });
  }
  async function getUpcomingMeetings(
    setUpcomingDoctors: React.Dispatch<React.SetStateAction<IMeet[]>>,
    setUpcomingPatients: React.Dispatch<React.SetStateAction<IMeet[]>>
  ) {
    instance
      .get("http://localhost:3001/meeting/upcoming-meetings")
      .then((res) => {
        setUpcomingDoctors(res.data.meetingsDoctors);
        setUpcomingPatients(res.data.meetingsPatients);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function meetingCompleted(meetingId: string) {
    instance
      .patch("http://localhost:3001/meeting/meeting-completed", { meetingId })
      .then(() => {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Meeting Completed",
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
  async function cancelMeeting(
    meetingId: string,
    setUpcomingDoctors: React.Dispatch<React.SetStateAction<IMeet[]>>,
    setUpcomingPatients: React.Dispatch<React.SetStateAction<IMeet[]>>
  ) {
    instance
      .delete(`http://localhost:3001/meeting/cancel-meeting/${meetingId}`)
      .then(() => {
        setUpcomingDoctors((prev) => {
          const arr = prev.filter((meet) => meet._id !== meetingId);
          return [...arr];
        });
        setUpcomingPatients((prev) => {
          const arr = prev.filter((meet) => meet._id !== meetingId);
          return [...arr];
        });
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Meeting Canceled Successfuly",
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 3000,
            type: "DELETE",
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function startMeet(
    doctorId: string,
    patientId: string,
    meetingUrl: string
  ) {
    instance
      .post("http://localhost:3001/meeting/start-meeting", {
        doctorId,
        patientId,
        meetingUrl,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }
  async function getStats(
    id: string,
    setStats: React.Dispatch<React.SetStateAction<IUserStats | null>>
  ) {
    instance
      .get(`http://localhost:3001/meeting/get-user-stats/${id}`)
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => console.log(err));
  }

  return {
    postMeeting,
    getUpcomingMeetings,
    startMeet,
    meetingCompleted,
    cancelMeeting,
    getOneMeeting,
    getStats,
  };
}
