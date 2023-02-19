import "./app.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetOneUser } from "../../hooks/useGetOneUser";
import { User } from "../../types/type";

const OneProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const { getUser } = useGetOneUser(id!, setUser);

  useEffect(() => {
    if (id) {
      getUser();
    }
  }, []);
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
    </div>
  );
};

export default OneProfile;
