import { useSelector } from "react-redux";
import TimeSelect from "../../components/TimeSelect/TimeSelect";
import { UserType } from "../../features/userSlice";
import "./app.scss";
// ✔
const ProfilePage = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
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
          {user?.role != 0 && (
            <div className="row">
              <p>
                <span className="fitEmoji">✔️ </span>Status:
              </p>
              <p>{user?.approved ? "Approved" : "Pending"}</p>
            </div>
          )}
          <div className="row">
            <p>
              <span className="fitEmoji">
                {user?.role == 0 ? "👨‍⚖️ " : user?.role == 1 ? "👨‍⚕️" : "🧑"}
              </span>
              Role:
            </p>
            <p>
              {user?.role == 0
                ? "Admin"
                : user?.role == 1
                ? "Doctor"
                : "Patient"}
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
        {user && user.role == 1 && (
          <div className="workTime">
            <TimeSelect />
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
