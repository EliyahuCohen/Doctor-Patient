import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeSelect from "../../components/TimeSelect/TimeSelect";
import { UserType } from "../../features/userSlice";
import { useGetOneUser } from "../../hooks/useGetOneUser";
import { User } from "../../types/type";
import "./app.scss";

const ProfilePage = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const [theUser, setTheUser] = useState<User | null>(null);
  const { getUser } = useGetOneUser(user?._id!, setTheUser);
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <div className="profileWrapper">
        <div className="innerWrraper">
          <p className="headline">Personal information </p>
          <div className="row">
            <p>
              <span className="fitEmoji">🖋️</span>Full Name:
            </p>
            <p>
              {theUser?.fName} {theUser?.lName}
            </p>
          </div>
          <div className="row">
            <p>
              <span className="fitEmoji">👫</span>Gender:
            </p>
            <p>{theUser?.isMale ? "👨 " : "👩"}</p>
          </div>
          <div className="row">
            <p>
              <span className="fitEmoji">📍</span>Location:
            </p>
            <p>{theUser?.location}</p>
          </div>
          <div className="row">
            <p>
              <span className="fitEmoji">📧 </span>Email:
            </p>
            <p>{theUser?.email}</p>
          </div>
          {theUser?.role != 0 && (
            <div className="row">
              <p>
                <span className="fitEmoji">✔️ </span>Status:
              </p>
              <p>{theUser?.approved ? "Approved" : "Pending"}</p>
            </div>
          )}
          <div className="row">
            <p>
              <span className="fitEmoji">
                {theUser?.role == 0 ? "👨‍⚖️ " : theUser?.role == 1 ? "👨‍⚕️" : "🧑"}
              </span>
              Role:
            </p>
            <p>
              {theUser?.role == 0
                ? "Admin"
                : theUser?.role == 1
                ? "Doctor"
                : "Patient"}
            </p>
          </div>
          {theUser?.role == 1 ? (
            <div className="row">
              <p>
                <span className="fitEmoji">💉</span>Speciality:
              </p>
              <p>{theUser?.speciality}</p>
            </div>
          ) : null}
        </div>
        {theUser && theUser.role == 1 && (
          <div className="workTime">
            <TimeSelect />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
