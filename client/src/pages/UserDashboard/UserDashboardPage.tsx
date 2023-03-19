import "./app.scss";
import Image from "../../assets/service.png";
import { useState } from "react";
import { User } from "../../types/type";
import { useGetUserDoctorPatients } from "../../hooks/useGetUserDoctorPatients";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { Link } from "react-router-dom";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export enum stage {
  ALL,
  DOCTORS,
  PATIENTS,
}

const UserDashboardPage = () => {
  const { token, user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
  const [show, setShow] = useState<number>(stage.ALL);

  const a = useGetUserDoctorPatients(setDoctors, setPatients, token);
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
        <img src={Image} alt="" />
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
          {doctors.concat(patients).map((user) => {
            if (user.role == show || show == 0)
              return (
                <div className="userLine" key={user._id}>
                  <div>
                    <strong>{user.fName + " " + user.lName}</strong>
                    <div className="userInfo">
                      <p className="email">{user.email}</p>
                    </div>
                  </div>
                  <div className={`${user.isMale ? "male" : "female"}`}>
                    {user.isMale ? "Male" : "Female"}
                  </div>
                  <div className="icons">
                    {user.role == 1 ? (
                      <Link to={`/booking/${user._id}`}>
                        <LibraryBooksIcon className="lib" />
                      </Link>
                    ) : null}
                    <Link to={`/communication/${user._id}`}>
                      <WhatsAppIcon className="what" />
                    </Link>
                  </div>
                </div>
              );
          })}
        </div>
        <p className="message">upcoming appointments</p>
      </div>
    </div>
  );
};

export default UserDashboardPage;
