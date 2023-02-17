import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { adminUsers } from "../../features/adminSlice";
import { UserType } from "../../features/userSlice";
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
    <div className="profileWrapper">
      <div className="innerWrraper">
        <p className="headline">User information </p>
        <div className="row">
          <p>
            <span className="fitEmoji">🖋️</span>Full Name:
          </p>
          <p>
            {user?.fName} {user?.lName}
          </p>
        </div>
        <div className="row">
          <p>
            <span className="fitEmoji">👫</span>Gender:
          </p>
          <p>{user?.isMale ? "👨 " : "👩"}</p>
        </div>
        <div className="row">
          <p>
            <span className="fitEmoji">📍</span>Location:
          </p>
          <p>{user?.location}</p>
        </div>
        <div className="row">
          <p>
            <span className="fitEmoji">📧 </span>Email:
          </p>
          <p>{user?.email}</p>
        </div>
        <div className="row">
          <p>
            <span className="fitEmoji">✔️ </span>Status:
          </p>
          <p>{user?.approved ? "Approved" : "Pending"}</p>
        </div>
        <div className="row">
          <p>
            <span className="fitEmoji">
              {user?.role == 0 ? "👨‍⚖️ " : user?.role == 1 ? "👨‍⚕️" : "🧑"}
            </span>
            Role:
          </p>
          <p>
            {user?.role == 0 ? "Admin" : user?.role == 1 ? "Doctor" : "Patient"}
          </p>
        </div>
        {user?.role == 1 ? (
          <div className="row">
            <p>
              <span className="fitEmoji">💉</span>Speciality:
            </p>
            <p>{user?.speciality}</p>
          </div>
        ) : null}
      </div>
      {!user.approved ? (
        <div>
          <span className="fitEmoji"></span>
          <button className="approveBtn">Approve</button>
        </div>
      ) : (
        <div>
          <span className="fitEmoji"></span>
          <button className="approveBtn reject">Reject</button>
        </div>
      )}
    </div>
  );
};

export default OneProfile;
