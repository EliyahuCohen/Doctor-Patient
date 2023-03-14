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
          <p onClick={() => setShow(stage.ALL)}>
            {show == 0 && <span className="indicator"></span>}
            All <span>({doctors.length + patients.length})</span>
          </p>
          {user?.role == 2 || user?.role == 1 ? (
            <p onClick={() => setShow(stage.DOCTORS)}>
              {show == 1 && <span className="indicator"></span>}
              My Doctors <span>({doctors.length})</span>
            </p>
          ) : null}
          {user?.role == 1 ? (
            <p onClick={() => setShow(stage.PATIENTS)}>
              {show == 2 && <span className="indicator"></span>}
              My Patients <span>({patients.length})</span>
            </p>
          ) : null}
        </div>
        <div className="adding">
          <Link to={"add-doctor"}>
            <button title={"add doctor"}>
              <AddIcon fontSize="medium" className="icon" />
            </button>
          </Link>
        </div>
      </div>
      <div className="list">
        <div>
          {(show == 0 || show == 1) && (
            <div style={{ padding: "1rem" }}>
              {show != 0
                ? doctors.length == 0 && (
                    <h3 className="systemMessage">No Doctors Yet</h3>
                  )
                : null}
              {show != 0
                ? doctors.length == 0 &&
                  patients.length == 0 && (
                    <h3 className="systemMessage">No Patients nor Doctors</h3>
                  )
                : null}
              {user?.role == 1 || user?.role == 2
                ? doctors.map((doc) => {
                    if (doc.approved) {
                      return (
                        <div className="userLine" key={doc._id}>
                          <div className="first">
                            <span>👨‍⚕️</span>
                            <div>
                              <strong>
                                {doc.fName} {doc.lName}
                              </strong>
                              <p>{doc.location}</p>
                            </div>
                          </div>
                          <div>
                            <p className="gender specialityColor">
                              {doc.speciality}
                            </p>
                          </div>
                          <div>
                            <p>{doc.email}</p>
                          </div>
                          <div className="buttons">
                            <Link to={`/booking/${doc._id}`}>
                              <LibraryBooksIcon
                                className="icon"
                                fontSize="medium"
                              />
                            </Link>
                            <Link to={`/communication/${doc._id}`}>
                              <WhatsAppIcon
                                className="icon"
                                fontSize="medium"
                              />
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  })
                : null}
            </div>
          )}

          {(show == 0 || show == 2) && (
            <div style={{ padding: "1rem" }}>
              {user?.role == 1 && patients.length == 0 && (
                <h3 className="systemMessage">No Patients Yet</h3>
              )}
              {user?.role == 1
                ? patients.map((doc) => {
                    if (doc.approved) {
                      return (
                        <div className="userLine" key={doc._id}>
                          <div className="first">
                            <span>👨‍⚕️</span>
                            <div>
                              <strong>
                                {doc.fName} {doc.lName}
                              </strong>
                              <p>{doc.location}</p>
                            </div>
                          </div>
                          <div>
                            <p
                              className={`gender ${
                                doc.isMale ? "male" : "female"
                              }`}
                            >
                              {doc.isMale ? "Male" : "Female"}
                            </p>
                          </div>
                          <div>
                            <p>{doc.email}</p>
                          </div>
                          <div className="buttons">
                            {doc.role == 0 ? (
                              <Link to={`/booking/${doc._id}`}>
                                <LibraryBooksIcon
                                  className="icon"
                                  fontSize="medium"
                                />
                              </Link>
                            ) : null}
                            <Link to={`/communication/${doc._id}`}>
                              <WhatsAppIcon
                                className="icon2"
                                fontSize="medium"
                              />
                            </Link>
                          </div>
                        </div>
                      );
                    }
                  })
                : null}
            </div>
          )}
        </div>
        <p className="message">upcoming appointments</p>
      </div>
    </div>
  );
};

export default UserDashboardPage;
