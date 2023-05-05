import { useState, lazy } from "react";
import { BsCalendarDate, BsGrid1X2 } from "react-icons/bs";
import { TbMessageCircle2 } from "react-icons/tb";
import { BiBed } from "react-icons/bi";
import { FiUser } from "react-icons/fi";
import { GiDoctorFace } from "react-icons/gi";
import { AiOutlineSchedule } from "react-icons/ai";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import "./app.scss";
import { CgPill } from "react-icons/cg";

const SystemMessagesPage = lazy(
  () => import("../../components/SystemMessages/SystemMessagesPage")
);
const Prescription = lazy(
  () => import("../../components/Prescriptions/Prescriptions")
);
const ProfilePage = lazy(() => import("../../components/Profile/ProfilePage"));
const OurDoctorAndPatients = lazy(
  () => import("../../components/OurDoctorAndPatients/OurDoctorAndPatients")
);
const HomeTab = lazy(() => import("../../components/HomeTab/HomeTab"));
const MyAppointments = lazy(
  () => import("../../components/MyAppointments/MyAppointments")
);
const UserDashboardPage = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );

  const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(1);
  function changeTab(tabNumber: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) {
    setSelected(tabNumber);
  }
  return (
    <div className="dashboardWrapper">
      <div className="sidebar">
        <div
          className={`${selected == 1 ? "selected" : ""}`}
          onClick={() => changeTab(1)}
        >
          <BsGrid1X2 />
          <p>Home</p>
        </div>
        <div
          className={`${selected == 2 ? "selected" : ""}`}
          onClick={() => changeTab(2)}
        >
          <FiUser />
          <p>Profile</p>
        </div>
        <div
          className={`${selected == 3 ? "selected" : ""}`}
          onClick={() => changeTab(3)}
        >
          <GiDoctorFace />
          <p>My Doctors</p>
        </div>

        {user?.role == 1 && user.approved && (
          <div
            className={`${selected == 4 ? "selected" : ""}`}
            onClick={() => changeTab(4)}
          >
            <BiBed />
            <p>My Patients</p>
          </div>
        )}
        <div
          className={`${selected == 5 ? "selected" : ""}`}
          onClick={() => changeTab(5)}
        >
          <TbMessageCircle2 />
          <p>Messages</p>
        </div>
        <div
          className={`${selected == 8 ? "selected" : ""}`}
          onClick={() => {
            setSelected(8);
          }}
        >
          <BsCalendarDate />
          <p>My Appointments</p>
        </div>
        <div
          className={`${selected == 6 ? "selected" : ""}`}
          onClick={() => changeTab(6)}
        >
          <CgPill />
          <p>My Prescriptions</p>
        </div>
        {user?.role == 1 && user.approved && (
          <div
            className={`${selected == 7 ? "selected" : ""}`}
            onClick={() => changeTab(7)}
          >
            <AiOutlineSchedule />
            <p>My Shifts</p>
          </div>
        )}
      </div>
      <div className="result">
        {selected == 1 && <HomeTab />}
        {selected == 2 && <ProfilePage selected={1} />}
        {selected == 3 && <OurDoctorAndPatients selected={1} />}
        {selected == 4 && user?.role == 1 && user.approved && (
          <OurDoctorAndPatients selected={2} />
        )}
        {selected == 5 && <SystemMessagesPage />}
        {selected == 6 && <Prescription />}
        {user?.role == 1 && user.approved && selected == 7 && (
          <ProfilePage selected={2} />
        )}
        {user?.role != 0 && user?.approved && selected == 8 && (
          <MyAppointments />
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
