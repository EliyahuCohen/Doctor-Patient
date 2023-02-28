import "./app.scss";
import Image from "../../assets/service.png";
import { useState } from "react";
import { User } from "../../types/type";
import { useGetUserDoctorPatients } from "../../hooks/useGetUserDoctorPatients";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import AdminUserLine from "../../components/AdminUserLine/AdminUserLine";
import { Link } from "react-router-dom";
const UserDashboardPage = () => {
  const { token, user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const [doctors, setDoctors] = useState<User[]>([]);
  const [patients, setPatients] = useState<User[]>([]);
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
      <div className="sections">
        {user?.role == 2 || user?.role == 1 ? (
          <p>My Doctors({doctors.length})</p>
        ) : null}
        {user?.role == 1 ? <p>My Patients({patients.length})</p> : null}
      </div>
      <div className="list">
        {doctors.length == 0 && (
          <h3 className="systemMessage">No Doctors Yet</h3>
        )}
        {user?.role == 1 || user?.role == 2
          ? doctors.map((doc) => {
              return (
                <Link key={doc._id} to={`/communication/${doc._id}`}>
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
                      <p>{doc.speciality}</p>
                    </div>
                    <div>
                      <p>{doc.email}</p>
                    </div>
                  </div>
                </Link>
              );
            })
          : null}
        {user?.role == 1 && patients.length == 0 && (
          <h3 className="systemMessage">No Patients Yet</h3>
        )}
        {user?.role == 1
          ? patients.map((doc) => {
              return (
                <Link key={doc._id} to={`/communication/${doc._id}`}>
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
                      <p className="gender">{doc.isMale ? "Male" : "Female"}</p>
                    </div>
                    <div>
                      <p>{doc.email}</p>
                    </div>
                  </div>
                </Link>
              );
            })
          : null}
      </div>
    </div>
  );
};

export default UserDashboardPage;
