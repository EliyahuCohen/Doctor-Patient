import React from "react";
import "./app.scss";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";

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
    </div>
  );
};

export default React.memo(HomeTab);
