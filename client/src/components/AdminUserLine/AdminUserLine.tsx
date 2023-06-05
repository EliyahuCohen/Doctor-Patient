import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../types/type";
import React from "react";
import { FiChevronDown } from "react-icons/fi";
import "./userLine.scss";

const AdminUserLine = ({ user, status }: { user: User; status: boolean }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => (status ? navigate(`/profile/${user._id}`) : null)}
      className={`user-info ${!status && "diffUser"}`}
    >
      <p className="mainLine">
        {status && (
          <span
            title="is user online"
            className={`${user.live ? "live" : ""}`}
          ></span>
        )}
        {user.email}
      </p>

      <p>{user.role == 1 ? "Doctors" : "Patient"}</p>
      <p className={`status ${user.approved ? "approved" : "pending"}`}>
        {user.approved ? "Approved" : "Blocked"}
      </p>
      <p className="delete-small time">
        {format(new Date(user.createdAt), "dd/MM/yyyy")}
      </p>
      <p title="more details" className="arrow delete-small">
        {!window.location.pathname.includes("profile") && (
          <Link to={`/profile/${user._id}`}>
            <FiChevronDown className="goToUser" title="go to user" />
          </Link>
        )}
      </p>
    </div>
  );
};

export default React.memo(AdminUserLine);
