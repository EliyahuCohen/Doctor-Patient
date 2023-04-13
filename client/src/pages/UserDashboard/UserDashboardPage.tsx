import "./app.scss";
import Image from "../../assets/service.png";
import { useEffect, useState } from "react";
import { IMeet, User, stage } from "../../types/type";
import { useGetUserDoctorPatients } from "../../hooks/useGetUserDoctorPatients";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { Link } from "react-router-dom";
import UserDashborad from "../../components/DashboardUser/UserDashborad";
import { useMeetings } from "../../hooks/useMeetings";
import CheckIcon from "@mui/icons-material/Check";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { shuffleArray } from "../../Utils/functions";
const UserDashboardPage = () => {
  const { token, user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );

  const [doctors, setDoctors] = useState<User[]>([]);
  const [tabNumber, setTabNumber] = useState<number>(1);
  const [patients, setPatients] = useState<User[]>([]);
  const [show, setShow] = useState<number>(stage.ALL);
  const [upcomingDoctors, setUpcomingDoctors] = useState<IMeet[]>([]);
  const [upcomingPatients, setUpcomingPatients] = useState<IMeet[]>([]);

  const a = useGetUserDoctorPatients(setDoctors, setPatients, token);
  const { getUpcomingMeetings, cancelMeeting, meetingCompleted } =
    useMeetings();
  useEffect(() => {
    getUpcomingMeetings(setUpcomingDoctors, setUpcomingPatients);
  }, []);
  return (
    <div className="dashboardWrapper">
      <div className="headingMessage">
        <div>
          <h1>
            We focus on <br /> your Story
          </h1>
          <p>
            Beacuse our goal, is to provide you with a list of services and
            doctors that are very reliable as you are with us
          </p>
        </div>
        <img src={Image} alt="opening screen image" />
      </div>
      <div className="sectionWrapper">
        <div className="sections">
          <p
            className={show == 0 ? "selected" : ""}
            onClick={() => setShow(stage.ALL)}
          >
            All
          </p>
          {user?.role == 2 || user?.role == 1 ? (
            <p
              className={show == 1 ? "selected" : ""}
              onClick={() => setShow(stage.DOCTORS)}
            >
              My Doctors
            </p>
          ) : null}
          {user?.role == 1 ? (
            <p
              className={show == 2 ? "selected" : ""}
              onClick={() => setShow(stage.PATIENTS)}
            >
              My Patients
            </p>
          ) : null}
        </div>
        <div className="adding">
          <Link to={"add-doctor"}>
            <button title={"add doctor"}>
              <AddIcon fontSize="medium" className="icon add" />
            </button>
          </Link>
        </div>
      </div>
      <div className="list">
        <div className="users">
          {shuffleArray(doctors.concat(patients)).map((user) => {
            if (user.role == show || show == 0)
              return <UserDashborad key={user._id} user={user} />;
          })}
        </div>
        <div>
          <div className="meetingsWrapper">
            <p className="message">Upcoming Appointments</p>
            <div className="sections">
              {user?.role != 2 && (
                <button
                  className={tabNumber == 1 ? "btn selected" : "btn"}
                  onClick={() => setTabNumber(1)}
                >
                  With Doctors ({upcomingDoctors.length})
                </button>
              )}
              {user?.role == 1 && (
                <button
                  className={tabNumber == 2 ? "btn selected" : "btn"}
                  onClick={() => setTabNumber(2)}
                >
                  With Patients ({upcomingPatients.length})
                </button>
              )}
            </div>
            {tabNumber == 1 && upcomingDoctors.length == 0 && (
              <p className="message">NO MEETINGS</p>
            )}
            {tabNumber == 2 && upcomingPatients.length == 0 && (
              <p className="message">NO MEETINGS</p>
            )}
            {(upcomingDoctors.length > 0 || upcomingPatients.length > 0) && (
              <div>
                {tabNumber == 1 &&
                  upcomingDoctors
                    .sort((one, two) => one.startTime - two.startTime)
                    .map((meeting: IMeet, index: number) => {
                      return (
                        <div
                          className={
                            index == 0
                              ? "oneMeeting firstMeeting"
                              : `oneMeeting`
                          }
                          key={meeting._id}
                        >
                          <div>
                            <p className="startMeetingTime">
                              {meeting.startTime}:00{" "}
                              <span>
                                {meeting.startTime > 12 ? "PM" : "AM"}
                              </span>
                            </p>
                            <p className="meetingTitle">
                              Meeting With {meeting.doctorName}
                            </p>
                          </div>
                          <div className="deleteAndCheck">
                            {meeting.doctorId == user?._id && (
                              <CheckIcon
                                fontSize="small"
                                className="check"
                                titleAccess="Meeting Completed"
                                onClick={() =>
                                  meetingCompleted(
                                    meeting._id,
                                    setUpcomingDoctors,
                                    setUpcomingPatients,
                                    tabNumber
                                  )
                                }
                              />
                            )}
                            <DeleteOutlineOutlinedIcon
                              fontSize="small"
                              titleAccess="Meeting Canceled"
                              className="trash"
                              onClick={() =>
                                cancelMeeting(
                                  meeting._id,
                                  setUpcomingDoctors,
                                  setUpcomingPatients,
                                  tabNumber
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                {tabNumber == 2 &&
                  upcomingPatients.length > 0 &&
                  upcomingPatients
                    .sort((one, two) => one.startTime - two.startTime)
                    .map((meeting: IMeet, index: number) => {
                      return (
                        <div
                          className={
                            index == 0
                              ? "oneMeeting firstMeeting"
                              : `oneMeeting`
                          }
                          key={meeting._id}
                        >
                          <div>
                            <p className="startMeetingTime">
                              {meeting.startTime}:00{" "}
                              <span>
                                {meeting.startTime > 12 ? "PM" : "AM"}
                              </span>
                            </p>
                            <p className="meetingTitle">
                              Meeting With {meeting.patientName}
                            </p>
                          </div>
                          <div className="deleteAndCheck">
                            {meeting.doctorId == user?._id && (
                              <CheckIcon
                                fontSize="small"
                                className="check"
                                titleAccess="Meeting Completed"
                                onClick={() =>
                                  meetingCompleted(
                                    meeting._id,
                                    setUpcomingDoctors,
                                    setUpcomingPatients,
                                    tabNumber
                                  )
                                }
                              />
                            )}
                            <DeleteOutlineOutlinedIcon
                              fontSize="small"
                              titleAccess="Meeting Canceled"
                              className="trash"
                              onClick={() =>
                                cancelMeeting(
                                  meeting._id,
                                  setUpcomingDoctors,
                                  setUpcomingPatients,
                                  tabNumber
                                )
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
