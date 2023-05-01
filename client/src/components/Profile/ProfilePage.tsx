import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TimeSelect from "../TimeSelect/TimeSelect";
import { UserType } from "../../features/userSlice";
import { useGetOneUser } from "../../hooks/useGetOneUser";
import { User } from "../../types/type";
import { FiEdit3 } from "react-icons/fi";
import { CgRename } from "react-icons/cg";
import "./app.scss";
import { useUpdateRole } from "../../hooks/useUpdateRole";
import { TbGenderFemme } from "react-icons/tb";
import { FaFemale, FaMale } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { BiMailSend } from "react-icons/bi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineLocationOn,
} from "react-icons/md";
import { RiStethoscopeLine } from "react-icons/ri";
import { ImSleepy } from "react-icons/im";
import { VscWorkspaceTrusted } from "react-icons/vsc";

const ProfilePage = ({ selected }: { selected: number }) => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const [theUser, setTheUser] = useState<User | null>(null);
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
      {theUser == null && <div className="centerLoading">Loading...</div>}
      <div className="profileWrapper">
        {selected == 1 && theUser && (
          <p className="headline">
            Personal information
            <FiEdit3
              title="edit"
              className="updateInfo"
              onClick={() => {
                setUpodateOpen((prev) => !prev);
              }}
              fontSize="1.5rem"
            />
          </p>
        )}
        {selected == 1 && (
          <div className="innerWrraper">
            <div className="row">
              <p>
                <span className="fitEmoji">
                  <CgRename color="#5bc0de  " />
                </span>
                Full Name:
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
                <span className="fitEmoji">
                  <TbGenderFemme
                    color="d770ff
 "
                  />
                </span>
                Gender:
              </p>
              <p>
                {theUser?.isMale ? (
                  <FaMale color="#40c4ff  " style={{ fontSize: "1.5rem" }} />
                ) : (
                  <FaFemale color="#ff7eb9  " style={{ fontSize: "1.5rem" }} />
                )}
              </p>
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
                <span className="fitEmoji">
                  <MdOutlineLocationOn color="#6ab04c  " />
                </span>
                Location:
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
                <span className="fitEmoji">
                  <BiMailSend color="#f4b400  " />{" "}
                </span>
                Email:
              </p>
              <p>{theUser?.email}</p>
            </div>
            {theUser?.role != 0 && (
              <div className="row">
                <p>
                  <span className="fitEmoji">
                    <GrStatusGood color="#d770ff " />
                  </span>
                  Status:
                </p>
                <p>{theUser?.approved ? "Approved" : "Pending"}</p>
              </div>
            )}
            <div className="row">
              <p>
                <span className="fitEmoji">
                  {theUser?.role == 0 ? (
                    <MdOutlineAdminPanelSettings color="#dc3545   " />
                  ) : theUser?.role == 1 ? (
                    <RiStethoscopeLine color="#17a2b8   " />
                  ) : (
                    <ImSleepy color="#007bff    " />
                  )}
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
                  <span className="fitEmoji">
                    <VscWorkspaceTrusted color="#5e5ce6 " />
                  </span>
                  Speciality:
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
      </div>
    </>
  );
};

export default React.memo(ProfilePage);
