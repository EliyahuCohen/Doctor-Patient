import { useEffect, useState } from "react";
import { useGetAdminUsers } from "../../hooks/useGetAdminUsers";
import { User } from "../../types/type";
import { SortArray } from "../../Utils/functions";
import "./app.scss";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { adminUsers } from "../../features/adminSlice";
import AdminUserLine from "../../components/AdminUserLine/AdminUserLine";

const AdminPage = () => {
  const [selected, setSelected] = useState<number>(0);
  const { getUsers } = useGetAdminUsers();
  const { users } = useSelector(
    (state: { adminSlice: adminUsers }) => state.adminSlice
  );
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );

  useEffect(() => {
    getUsers();
  }, []);

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
          <AdminUserLine user={user}/>
        );
      })}
    </div>
  );
};

export default AdminPage;
