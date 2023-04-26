import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/type";
import React from "react";

const AdminUserLine = ({ user, status }: { user: User; status: boolean }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => (status ? navigate(`/profile/${user._id}`) : null)}
      className="user-info"
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
        {user.approved ? "Approved" : "Pending"}
      </p>
      <p className="delete-small">
        {format(new Date(user.createdAt), "dd/MM/yyyy")}
      </p>
      <p title="more details" className="arrow delete-small">
        🧐
      </p>
    </div>
  );
};

export default React.memo(AdminUserLine);
