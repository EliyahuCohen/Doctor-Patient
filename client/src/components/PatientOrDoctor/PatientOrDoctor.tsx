import { User } from "../../types/type";
import { FaTooth, FaGlasses, FaStethoscope } from "react-icons/fa";
import { SlUserFemale } from "react-icons/sl";
import "./app.scss";
import { MdOutlineExpandMore, MdOutlinePersonPin } from "react-icons/md";
import { motion, useAnimate, usePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserType } from "../../features/userSlice";
import { useSelector } from "react-redux";
import { useUpdateRole } from "../../hooks/useUpdateRole";
import { usePrescriptions } from "../../hooks/usePrescriptions";

const PatientOrDoctor = ({
  user,
  status,
  setDoctors,
  setMoreDoctors,
  canRemove,
  index,
  setModalUser,
  isMore,
}: {
  status: boolean;
  user: User;
  setDoctors: React.Dispatch<React.SetStateAction<User[]>>;
  setMoreDoctors: React.Dispatch<React.SetStateAction<User[] | null>>;
  canRemove: boolean;
  index: number;
  setModalUser?: React.Dispatch<React.SetStateAction<User | null>>;
  isMore: boolean;
}) => {
  //state to contain the open and close state of the modal

  //
  const [scope, animate] = useAnimate();
  const [isPresence, safeToRemove] = usePresence();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user: TheUser } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const { updateUserDoctorsList } = useUpdateRole(TheUser!._id);
  const { submitPrescription } = usePrescriptions();
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

  useEffect(() => {
    async function checkAnimation() {
      if (isPresence) {
        await animate(
          scope.current,
          {
            opacity: [0, 1],
          },
          { duration: 0.5, delay: 0.2 * index }
        );
      }
    }
    checkAnimation();
  }, []);
  return (
    <motion.div ref={scope} className="oneUserWrapper">
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

          {user.role == 1 && canRemove && !isMore && (
            <Link className="meetingBtn" to={`/booking/${user._id}`}>
              Schedual
            </Link>
          )}
          {!isMore && (
            <Link className="talkBtn" to={`/communication/${user._id}`}>
              Let's Talk
            </Link>
          )}
          {user.role == 1 && canRemove && (
            <div className="addDoctor" onClick={removeAddDoctors}>
              {status ? (
                <p className="adding">Add</p>
              ) : (
                <p className="removing">Remove</p>
              )}
            </div>
          )}
          {!canRemove && (
            <div className="prescription" onClick={() => setModalUser!(user)}>
              Prescription
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};

export default React.memo(PatientOrDoctor);
