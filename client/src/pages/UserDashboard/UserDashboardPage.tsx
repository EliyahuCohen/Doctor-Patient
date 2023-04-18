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
import { format } from "date-fns";
const UserDashboardPage = () => {
  const { token, user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const [searchText, setSearchText] = useState<string>("");
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
      <div className="searchField">
        <input
          type="text"
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search..."
        />
      </div>

      <div className="list">
        <div className="users">
          {show == 2 && patients.length == 0 && (
            <h3 style={{ textAlign: "center" }}>No Patients</h3>
          )}
          {show == 1 && doctors.length == 0 && (
            <h3 style={{ textAlign: "center" }}>No Doctors</h3>
          )}
          {doctors.concat(patients).map((us) => {
            if (
              us.role == show ||
              (show == 0 &&
                (us.email
                  .toLocaleLowerCase()
                  .includes(searchText.toLocaleLowerCase()) ||
                  us.fName
                    .toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase()) ||
                  us.lName
                    .toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase()) ||
                  us.location
                    .toLocaleLowerCase()
                    .includes(searchText.toLocaleLowerCase())))
            ) {
              if (user?.listOfPatients.includes(us._id)) {
                return (
                  <Link to={`/userDetials/${us._id}`} key={us._id}>
                    <UserDashborad key={us._id} user={us} />
                  </Link>
                );
              } else {
                return <UserDashborad key={us._id} user={us} />;
              }
            }
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
                  upcomingDoctors.map((meeting: IMeet, index: number) => {
                    return (
                      <div className="oneMeeting" key={meeting._id + index}>
                        <div>
                          <p className="meetingTime">
                            <strong>{meeting.startTime}:00 </strong>
                            <span className="nightDay">
                              {meeting.startTime > 12 ? " pm " : " am "}
                            </span>
                          </p>
                          <p className="rightSide">
                            {format(
                              new Date(
                                `${new Date(meeting.date).getMonth() + 1}-${
                                  new Date(meeting.date).getDate() - 1
                                }-${new Date(meeting.date).getFullYear()}`
                              ),
                              "dd/MM/yyyy"
                            )}
                          </p>
                        </div>
                        <div className="secondMeetingPart">
                          <p>Meetings with {meeting.doctorName}</p>
                          <p>{(meeting.endTime - meeting.startTime) * 60}min</p>
                        </div>
                        <div className="iconDiv">
                          {meeting.doctorId == user?._id && (
                            <CheckIcon
                              color="success"
                              fontSize="small"
                              titleAccess="Meeting Complete"
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
                            color="error"
                            fontSize="small"
                            titleAccess="Cancle Meeting"
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
                  upcomingPatients.map((meeting: IMeet, index: number) => {
                    return (
                      <div className="oneMeeting" key={meeting._id + index}>
                        <div>
                          <p className="meetingTime">
                            <strong>{meeting.startTime}:00 </strong>
                            <span className="nightDay">
                              {meeting.startTime > 12 ? " pm " : " am "}
                            </span>
                          </p>
                          <p className="rightSide">
                            {format(
                              new Date(
                                `${new Date(meeting.date).getMonth() + 1}-${
                                  new Date(meeting.date).getDate() - 1
                                }-${new Date(meeting.date).getFullYear()}`
                              ),
                              "dd/MM/yyyy"
                            )}
                          </p>
                        </div>
                        <div className="secondMeetingPart">
                          <p>Meetings with {meeting.patientName}</p>
                          <p>{(meeting.endTime - meeting.startTime) * 60}min</p>
                        </div>
                        <div className="iconDiv">
                          {meeting.doctorId == user?._id && (
                            <CheckIcon
                              color="success"
                              fontSize="small"
                              titleAccess="Meeting Complete"
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
                            color="error"
                            fontSize="small"
                            titleAccess="Cancle Meeting"
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
