import "./meet.scss";
import { IMeet } from "../../types/type";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { formatTime } from "../../Utils/functions";

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

  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );

  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 * index }}
      className="wrapperMeeting"
    >
      <div className="iconsHandle">
        {isDoctorTab ? (
          <AiOutlineCheckCircle
            onClick={() =>
              meetingCompleted(
                meeting._id,
                setUpcomingDoctors,
                setUpcomingPatients
              )
            }
            color="#10a37f"
          />
        ) : null}
        <MdOutlineRemoveCircleOutline
          onClick={() =>
            cancelMeeting(meeting._id, setUpcomingDoctors, setUpcomingPatients)
          }
          color="#FF0000"
        />
      </div>
      <div className="oneMeet">
        <span className="theDate">
          {format(new Date(`${month}-${day}-${year}`), "dd/MM/yyyy")}
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
