import "./app.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOneUser } from "../../hooks/useGetOneUser";
import { User } from "../../types/type";
import { useGetDoctorsAndPatients } from "../../hooks/useGetDoctorsAndPatients";
import AdminUserLine from "../../components/AdminUserLine/AdminUserLine";

const OneProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [userDoctors, setUserDoctors] = useState<User[]>([]);
  const [userPatients, setPatients] = useState<User[]>([]);
  const [tabNum, setTabNum] = useState<number>(0);
  const { getUser } = useGetOneUser(id!, setUser);
  const { getInfo } = useGetDoctorsAndPatients(
    setUserDoctors,
    setPatients,
    user
  );

  useEffect(() => {
    if (id) {
      getUser();
    }
  }, []);
  useEffect(() => {
    if (user != null) {
      getInfo();
    }
  }, [user != null]);
  if (!user) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div>
      <div className="profileWrapper">
        <span className="line"></span>
      </div>
      <div className="profileWrapper">
        <p className="image">{user.role == 1 ? "👨‍⚕️" : "😷"}</p>
        <div className="leftProfile">
          <h2>
            {user.fName} {user.lName}
            <span className="role">
              {user.role == 1 ? " (Doctor)" : " (Patient)"}
            </span>
          </h2>
          <div className="info">
            <p>
              <span>Location:</span>
              {user.location}
            </p>
            <p>
              <span>More:</span>
              social links
            </p>
          </div>
          {user.role == 1 ? (
            <ul>
              <li>
                Biography: A brief summary of the doctor's education,
                experience, and areas of expertise
              </li>
              <li>
                Specialties: A list of the doctor's areas of specialization,
                such as cardiology or pediatrics.
              </li>
              <li>
                Certifications: A list of the doctor's professional
                certifications, such as board certifications or specialized
                training.
              </li>
              <li>
                Contact information: The doctor's email address, phone number,
                and office location.
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                Medical history: A summary of the patient's medical history,
                including any chronic conditions or allergies.
              </li>
              <li>
                Medications: A list of the medications the patient is currently
                taking, including dosage and frequency.
              </li>
              <li>
                Health goals: A list of the patient's health goals, such as
                weight loss or reducing blood pressure.
              </li>
              <li>
                Contact information: The patient's email address, phone number,
                and emergency contact information.
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="bottomInfo">
        {user.approved == true ? (
          <div>
            <button className="block">Block</button>
          </div>
        ) : (
          <button>Approve</button>
        )}
      </div>
      <div className="tabsSection">
        <div className="tabs">
          <p onClick={() => setTabNum(0)}>Doctors</p>
          {user.role == 1 ? <p onClick={() => setTabNum(1)}>Patients</p> : null}
        </div>
        {tabNum == 0 && (
          <div>
            {userDoctors.map((doc) => {
              return <AdminUserLine key={doc._id} user={doc} />;
            })}
          </div>
        )}
        {tabNum == 1 && (
          <div>
            {userPatients.map((pat) => {
              return <AdminUserLine key={pat._id} user={pat} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OneProfile;
