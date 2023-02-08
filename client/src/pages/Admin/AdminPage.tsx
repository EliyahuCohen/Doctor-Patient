import { useEffect, useState } from "react";
import { useGetAdminUsers } from "../../hooks/useGetAdminUsers";
import { User } from "../../types/type";
import { SortArray } from "../../Utils/functions";
import { format } from "date-fns";
import "./app.scss";
import { useDispatch, useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { io } from "socket.io-client";
import {
  adminUsers,
  updateLiveUsers,
  updateStateLive,
} from "../../features/adminSlice";

export const socket = io("http://localhost:3001");

const AdminPage = () => {
  const [selected, setSelected] = useState<number>(0);
  const { getUsers } = useGetAdminUsers();
  const dispatch = useDispatch();
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const { users } = useSelector(
    (state: { adminSlice: adminUsers }) => state.adminSlice
  );

  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    socket.on("userLoggedIn", (sock: User) => {
      dispatch(updateStateLive(sock));
    });
    if (user?.role == 0) {
      dispatch(updateLiveUsers());
    }
  }, [socket && users.length > 0, users]);

  useEffect(() => {
    socket.on("updateAdmin", (data) => {
      console.log("something changed", data);
    });
  }, [socket]);
  return (
    <div className="admin">
      <div className="welcome">
        <h1>Welcome, {user?.fName} 👋</h1>
        <p>Good to see you boss!</p>
      </div>
      <div className="tags">
        <p
          className={`${selected == 0 ? "selected" : ""}`}
          onClick={() => setSelected(0)}
        >
          All Users
        </p>
        <p
          className={`${selected == 1 ? "selected" : ""}`}
          onClick={() => setSelected(1)}
        >
          Doctors
        </p>
        <p
          className={`${selected == 2 ? "selected" : ""}`}
          onClick={() => setSelected(2)}
        >
          Patients
        </p>
      </div>
      <div className="headlines">
        <p>Email</p>
        <p>Group</p>
        <p>Status</p>
        <p className="delete-small">Date</p>
        <p className="delete-small">Read More</p>
      </div>
      {SortArray(users, selected).map((user: User) => {
        return (
          <div key={user._id} className="user-info">
            <p className="mainLine">
              <span
                title="is user online"
                className={`${user.live ? "live" : ""}`}
              ></span>
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
      })}
    </div>
  );
};

export default AdminPage;
