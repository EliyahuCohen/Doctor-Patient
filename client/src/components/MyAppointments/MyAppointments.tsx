import { useEffect, useState, lazy } from "react";
import { motion } from "framer-motion";
import "./app.scss";
import { IMeet } from "../../types/type";
import { useMeetings } from "../../hooks/useMeetings";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";

const OneMeet = lazy(() => import("../OneMeet/OneMeet"));

const MyAppointments = () => {
  const [meetingDoctors, setMeetingsDoctors] = useState<IMeet[]>([]);
  const [meetingPatients, setMeetingsPatients] = useState<IMeet[]>([]);
  const [selected, setSelected] = useState<1 | 2>(1);
  const { getUpcomingMeetings, cancelMeeting, meetingCompleted } =
    useMeetings();
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );

  useEffect(() => {
    getUpcomingMeetings(setMeetingsDoctors, setMeetingsPatients);
  }, []);
  return (
    <div className="appointmentsWrapper">
      <h1>My Appointments</h1>
      <div className="headerButtons">
        <button
          onClick={() => setSelected(1)}
          className={`${selected == 1 ? "selected" : ""}`}
        >
          With Doctors ({0 || meetingDoctors.length})
        </button>
        {user?.role == 1 ? (
          <button
            className={`${selected == 2 ? "selected" : ""}`}
            onClick={() => setSelected(2)}
          >
            With Patients ({0 || meetingPatients.length})
          </button>
        ) : null}
      </div>
      <motion.div className="meetingsList">
        {selected == 1
          ? meetingDoctors.map((meet, index) => {
              return (
                <OneMeet
                  cancelMeeting={cancelMeeting}
                  meetingCompleted={meetingCompleted}
                  isDoctorTab={false}
                  index={1}
                  meeting={meet}
                  key={meet._id}
                  setUpcomingPatients={setMeetingsDoctors}
                  setUpcomingDoctors={setMeetingsDoctors}
                />
              );
            })
          : meetingPatients.map((meet, index) => {
              return (
                <OneMeet
                  setUpcomingDoctors={setMeetingsPatients}
                  setUpcomingPatients={setMeetingsDoctors}
                  cancelMeeting={cancelMeeting}
                  meetingCompleted={meetingCompleted}
                  isDoctorTab={true}
                  index={2}
                  meeting={meet}
                  key={meet._id}
                />
              );
            })}
      </motion.div>
    </div>
  );
};

export default MyAppointments;
