import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeSelect from "../../components/TimeSelect/TimeSelect";
import { UserType } from "../../features/userSlice";
import { useGetOneUser } from "../../hooks/useGetOneUser";
import { User } from "../../types/type";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import "./app.scss";
import { useUpdateRole } from "../../hooks/useUpdateRole";

const ProfilePage = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const [theUser, setTheUser] = useState<User | null>(null);
  const [selected, setSelected] = useState<1 | 2 | 3>(1);
  const [updateOpen, setUpodateOpen] = useState<boolean>(false);
  const { getUser } = useGetOneUser(user?._id!, setTheUser);
  const { updateUser } = useUpdateRole(user!._id);
  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setTheUser((prevState) => {
      if (prevState) {
        return {
          ...prevState,
          [name]: value,
        };
      }
      return null;
    });
  }
  function changeIsMale(value: boolean) {
    setTheUser((prevState) => {
      if (prevState) {
        return {
          ...prevState,
          isMale: value,
        };
      }
      return null;
    });
  }

  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <div className="filtering">
        <button
          onClick={() => setSelected(1)}
          className={`${selected == 1 ? "selected" : ""}`}
        >
          Edit User{" "}
        </button>
        <button
          onClick={() => setSelected(2)}
          className={`${selected == 2 ? "selected" : ""}`}
        >
          Manage Work Time
        </button>
        <button
          onClick={() => setSelected(3)}
          className={`${selected == 3 ? "selected" : ""}`}
        >
          Prescritption
        </button>
      </div>
      <div className="profileWrapper">
        {selected == 1 && (
          <div className="innerWrraper">
            <p className="headline">
              Personal information
              <ModeEditOutlinedIcon
                className="updateInfo"
                onClick={() => {
                  setUpodateOpen((prev) => !prev);
                }}
                fontSize="medium"
              />
            </p>
            <div className="row">
              <p>
                <span className="fitEmoji">🖋️</span>Full Name:
              </p>
              <p>
                {theUser?.fName} {theUser?.lName}
              </p>
            </div>
            <div className="rowInput">
              {updateOpen ? (
                <input
                  type="text"
                  value={theUser?.fName}
                  name="fName"
                  onChange={handleInputChange}
                />
              ) : null}
              {updateOpen ? (
                <input
                  type="text"
                  value={theUser?.lName}
                  name="lName"
                  onChange={handleInputChange}
                />
              ) : null}
            </div>
            <div className="row">
              <p>
                <span className="fitEmoji">👫</span>Gender:
              </p>
              <p>{theUser?.isMale ? "👨 " : "👩"}</p>
            </div>
            <div className="rowInput" style={{ marginTop: "1rem" }}>
              {updateOpen ? (
                <div className="isMaleSection">
                  <div>
                    <label htmlFor="isMale1">Male</label>
                    <input
                      id="isMale1"
                      type="radio"
                      name="isMale"
                      checked={theUser!.isMale}
                      onChange={() => changeIsMale(true)}
                    />
                  </div>
                  <div>
                    <label htmlFor="isMale2">Female</label>
                    <input
                      id="isMale2"
                      type="radio"
                      checked={!theUser!.isMale}
                      name="isMale"
                      onChange={() => changeIsMale(false)}
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="row">
              <p>
                <span className="fitEmoji">📍</span>Location:
              </p>
              <p>{theUser?.location}</p>
            </div>
            <div className="rowInput">
              {updateOpen ? (
                <input
                  type="text"
                  value={theUser?.location}
                  name="location"
                  onChange={handleInputChange}
                />
              ) : null}
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
                  {theUser?.role == 0
                    ? "👨‍⚖️ "
                    : theUser?.role == 1
                    ? "👨‍⚕️"
                    : "🧑"}
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
            {updateOpen ? (
              <div>
                <button
                  className="btn widthFull"
                  onClick={() =>
                    updateUser(theUser!).then(() => setUpodateOpen(false))
                  }
                >
                  Update User
                </button>
              </div>
            ) : null}
          </div>
        )}
        {theUser && theUser.role == 1 && selected == 2 && (
          <div className="workTime">
            <TimeSelect />
          </div>
        )}
        {user && selected == 3 && (
          <div>
            <h1>Prescription List:</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
