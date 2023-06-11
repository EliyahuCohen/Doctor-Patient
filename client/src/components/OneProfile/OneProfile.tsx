import "./onepro.scss";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOneUser } from "../../hooks/useGetOneUser";
import { User } from "../../types/type";
import { useGetDoctorsAndPatients } from "../../hooks/useGetDoctorsAndPatients";
import AdminUserLine from "../AdminUserLine/AdminUserLine";
import { useUpdateRole } from "../../hooks/useUpdateRole";
import { useFeedbacks } from "../../hooks/useFeedbacks";
import { IRating } from "../../types/type";
import Feedbacks from "../Feedbacks/Feedbacks";

const OneProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [fetched, setFetched] = useState<boolean>(false);
  const [userDoctors, setUserDoctors] = useState<User[]>([]);
  const [userPatients, setPatients] = useState<User[]>([]);
  const [tabNum, setTabNum] = useState<number>(0);
  const [feedbacks, setFeedbacks] = useState<IRating[]>([]);
  const { getUser } = useGetOneUser(id!, setUser);
  const { getFeedbacks } = useFeedbacks();
  const { getInfo } = useGetDoctorsAndPatients(
    setUserDoctors,
    setPatients,
    user
  );
  const { updateRole } = useUpdateRole(id!);
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
      <div className="loading">
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <div>
      <div className="profileWrapper">
        <span className="line2"></span>
      </div>
      <div className="profileWrapper second">
        <p className="image">{user.role == 1 ? "👨‍⚕️" : "😷"}</p>
        <div className="leftProfile">
          <h2>
            {user.fName} {user.lName}
            <span className="role">
              {user.role == 1 ? " (Doctor)" : " (Patient)"}
            </span>
          </h2>
          <div className="smallImage">
            <p>{user.role == 1 ? "👨‍⚕️" : "😷"}</p>
          </div>
          <h3>{user.fName + " " + user.lName}</h3>
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
            <button
              className="block"
              onClick={(e) => {
                updateRole(setUser);
              }}
            >
              Block
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              updateRole(setUser);
            }}
          >
            Approve
          </button>
        )}
      </div>
      <div className="tabsSection">
        <div className="tabs">
          <p
            onClick={() => setTabNum(0)}
            className={`${tabNum == 0 ? "mark" : ""}`}
          >
            Doctors ({userDoctors.length})
          </p>
          {user.role == 1 ? (
            <p
              onClick={() => setTabNum(1)}
              className={`${tabNum == 1 ? "mark" : ""}`}
            >
              Patients ({userPatients.length})
            </p>
          ) : null}
        </div>
        {tabNum == 0 && (
          <div className="users">
            {userDoctors.map((doc) => {
              return <AdminUserLine status={false} key={doc._id} user={doc} />;
            })}
            {userDoctors.length == 0 && (
              <h2 style={{ textAlign: "center" }}>No Doctors</h2>
            )}
          </div>
        )}
        {tabNum == 1 && (
          <div className="users">
            {userPatients.map((pat) => {
              return <AdminUserLine status={false} key={pat._id} user={pat} />;
            })}
            {userPatients.length == 0 && (
              <h2 style={{ textAlign: "center" }}>No Patients</h2>
            )}
          </div>
        )}
        <div className="ratingAndComments">
          <div className="rating">
            {!fetched && user.role != 2 ? (
              <button
                onClick={() => getFeedbacks(id!, setFetched, setFeedbacks)}
              >
                Show Rating And Feedback
              </button>
            ) : null}
          </div>
        </div>
        {user.role == 1 && (
          <div className="averageMeetingTime">
            <h3>
              Average Meeting Duration:{"  "}
              <span>
                {" "}
                {Math.round(
                  user.Duration.totalDuration /
                    60 /
                    user.Duration.meetingsAmount
                )}{" "}
              </span>
              Minutes
            </h3>
          </div>
        )}
        {fetched ? <Feedbacks feedbacks={feedbacks} /> : null}
      </div>
    </div>
  );
};

export default React.memo(OneProfile);
