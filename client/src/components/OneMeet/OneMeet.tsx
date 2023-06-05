import "./meet.scss";
import { IMeet } from "../../types/type";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { AiOutlineCheckCircle } from "react-icons/ai";
import {
  MdOutlineCallToAction,
  MdOutlineRemoveCircleOutline,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { formatTime } from "../../Utils/functions";
import { useNavigate } from "react-router-dom";
import { useMeetings } from "../../hooks/useMeetings";

const OneMeet = ({
  meeting,
  index,
  isDoctorTab,
  cancelMeeting,
  meetingCompleted,
  setUpcomingDoctors,
  setUpcomingPatients,
}: {
  setUpcomingDoctors: React.Dispatch<React.SetStateAction<IMeet[]>>;
  setUpcomingPatients: React.Dispatch<React.SetStateAction<IMeet[]>>;
  meeting: IMeet;
  index: number;
  isDoctorTab: boolean;
  cancelMeeting: (
    meetingId: string,
    setUpcomingDoctors: React.Dispatch<React.SetStateAction<IMeet[]>>,
    setUpcomingPatients: React.Dispatch<React.SetStateAction<IMeet[]>>
  ) => void;
  meetingCompleted: (
    meetingId: string,
    setUpcomingDoctors: React.Dispatch<React.SetStateAction<IMeet[]>>,
    setUpcomingPatients: React.Dispatch<React.SetStateAction<IMeet[]>>
  ) => void;
}) => {
  const day = new Date(meeting.date).getDate() - 1;
  const month = new Date(meeting.date).getMonth() + 1;
  const year = new Date(meeting.date).getFullYear();
  const navigate = useNavigate();
  const { startMeet } = useMeetings();

  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  function startMeeting() {
    if (user?.role === 1) {
      startMeet(
        meeting.doctorId,
        meeting.patientId,
        `http://localhost:5173/video-meeting/${meeting._id}`
      ).then(() => {
        navigate("/video-meeting/" + meeting._id);
      });
    }
  }

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 * index }}
      className="wrapperMeeting"
    >
      <div className="iconsHandle">
        {isDoctorTab ? (
          <MdOutlineCallToAction
            onClick={startMeeting}
            title="Start meeting"
            color="#777"
            style={{ marginRight: "5px" }}
          />
        ) : null}
        
        <MdOutlineRemoveCircleOutline
          title="Cancel meeting"
          onClick={() =>
            cancelMeeting(meeting._id, setUpcomingDoctors, setUpcomingPatients)
          }
          color="#FF0000"
        />
      </div>
      <div className="oneMeet">
        <span className="theDate">
          {format(new Date(`${month}-${day + 1}-${year}`), "dd/MM/yyyy")}
        </span>
        <strong>
          Meeting with{" "}
          {meeting.doctorName == user?.fName + " " + user?.lName
            ? meeting.patientName
            : meeting.doctorName}
        </strong>
        <p>{formatTime(meeting)}</p>
      </div>
    </motion.div>
  );
};

export default OneMeet;
