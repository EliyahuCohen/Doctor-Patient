import { User } from "../../types/type";
import { FaTooth, FaGlasses, FaStethoscope } from "react-icons/fa";
import { SlUserFemale } from "react-icons/sl";
import "./app.scss";
import { MdOutlineExpandMore, MdOutlinePersonPin } from "react-icons/md";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserType } from "../../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateRole } from "../../hooks/useUpdateRole";
const PatientOrDoctor = ({
  user,
  status,
  setDoctors,
  setMoreDoctors,
  canRemove,
}: {
  status: boolean;
  user: User;
  setDoctors: React.Dispatch<React.SetStateAction<User[]>>;
  setMoreDoctors: React.Dispatch<React.SetStateAction<User[] | null>>;
  canRemove: boolean;
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user: TheUser } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const { updateUserDoctorsList } = useUpdateRole(TheUser!._id);
  function removeAddDoctors() {
    if (status) {
      setDoctors((prev) => [...prev, user]);
      setMoreDoctors((prev) => prev!.filter((u) => u._id != user._id));
    } else {
      setDoctors((prev) => prev!.filter((u) => u._id != user._id));
      setMoreDoctors((prev) => [...prev!, user]);
    }
    updateUserDoctorsList(user._id);
  }
  return (
    <motion.div className="oneUserWrapper">
      <div className="topPart">
        <div className="userProfile">
          <div className="side1">
            {user.speciality == "optometrist" ? (
              <FaGlasses />
            ) : user.speciality == "family-doctor" ? (
              <FaStethoscope />
            ) : user.speciality == "dentist" ? (
              <FaTooth />
            ) : user.speciality == "dermatologist" ? (
              <SlUserFemale />
            ) : (
              <MdOutlinePersonPin />
            )}
          </div>
          <p className="names">{user.fName + " " + user.lName}</p>
        </div>
        {!isOpen ? (
          <MdOutlineExpandMore
            className="expandIcon"
            onClick={() => setIsOpen(true)}
          />
        ) : (
          <MdOutlineExpandMore
            className="expandIcon flipped"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
      {isOpen ? (
        <div className="bottomPart">
          <a className="emailBtn" href={`mailto:${user.email} `} title="email">
            Email
          </a>
          {user.role == 1 && canRemove && (
            <Link className="meetingBtn" to={`/booking/${user._id}`}>
              Schedual
            </Link>
          )}
          <Link className="talkBtn" to={`/communication/${user._id}`}>
            Let's Talk
          </Link>
          {user.role == 1 && canRemove && (
            <div className="addDoctor" onClick={removeAddDoctors}>
              {status ? (
                <p className="adding">Add</p>
              ) : (
                <p className="removing">Remove</p>
              )}
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};

export default PatientOrDoctor;
