import React from "react";
import "./home.scss";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { AiOutlineStar } from "react-icons/ai";

const HomeTab = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const date = new Date();
  return (
    <div className="homeTab">
      <h1>
        <b>
          Good
          {date.getHours() < 12
            ? " Morning"
            : date.getHours() > 12 && date.getHours() < 18
            ? " Afternoon"
            : " Evening"}
          ,
        </b>
      </h1>
      <p className="secondLineName">{user?.fName}</p>
      <p className="firstP">
        Here the information about your activity and condition
      </p>
      <div className="conditionBoxs">
        <div className="oneBox">
          <b>Meeting Finished</b>
          <p className="circle">{user?.meetingAmount}</p>
        </div>
        {user?.role == 1 ? (
          <div className="oneBox">
            <b>Rating</b>
            <p className="circle">
              {user.userRating.sum && user.userRating.votes
                ? `${user.userRating.sum / user.userRating.votes}`
                : null}
            </p>
          </div>
        ) : null}
        <div className="oneBox">
          <b>Doctors</b>
          <p className="circle">{user?.listOfDoctors.length}</p>
        </div>
        {user?.role == 1 ? (
          <div className="oneBox">
            <b>Patients</b>
            <p className="circle">{user?.listOfPatients.length}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(HomeTab);
