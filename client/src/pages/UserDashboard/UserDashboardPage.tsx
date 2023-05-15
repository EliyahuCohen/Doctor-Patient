import { useState, lazy, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";

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

  const [selected, setSelected] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7>(0);
  function changeTab(tabNumber: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7) {
    navigate(`/dashboard/${tabNumber}`)
    setSelected(tabNumber)
  }
  const { id } = useParams()
  const navigate = useNavigate()
  useEffect(() => {
    if (id && Number(id) < 8 && Number(id) >= 0) {
      if(user?.role==2&&Number(id)>5){
        changeTab(0)
        return;
      }
      if (user?.role == 2 && Number(id) < 7 && Number(id) >= 0) {
        setSelected(Number(id) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)
        console.log(Number(id))
      }
      else if (user?.role == 1) {
        setSelected(Number(id) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7)
        console.log(Number(id))
      }
    }
    else
      setSelected(1)
    console.log(Number(1))
  }, [])
  return (
    <div className="dashboardWrapper">
      <div className="sidebar">
        <div
          className={`${selected == 0 ? "selected" : ""}`}
          onClick={() => changeTab(0)}
        >
          <BsGrid1X2 />
          <p>Home</p>
        </div>
        <div
          className={`${selected == 1 ? "selected" : ""}`}
          onClick={() => changeTab(1)}
        >
          <FiUser />
          <p>Profile</p>
        </div>
        <div
          className={`${selected == 2 ? "selected" : ""}`}
          onClick={() => changeTab(2)}
        >
          <GiDoctorFace />
          <p>My Doctors</p>
        </div>


        <div
          className={`${selected == 3 ? "selected" : ""}`}
          onClick={() => changeTab(3)}
        >
          <TbMessageCircle2 />
          <p>Messages</p>
        </div>
        <div
          className={`${selected == 4 ? "selected" : ""}`}
          onClick={() => changeTab(4)}

        >
          <BsCalendarDate />
          <p>My Appointments</p>
        </div>
        <div
          className={`${selected == 5 ? "selected" : ""}`}
          onClick={() => changeTab(5)}
        >
          <CgPill />
          <p>My Prescriptions</p>
        </div>
        {user?.role == 1 && user.approved && (
          <div
            className={`${selected == 6 ? "selected" : ""}`}
            onClick={() => changeTab(6)}
          >
            <BiBed />
            <p>My Patients</p>
          </div>
        )}
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
        {selected == 0 && <HomeTab />}
        {selected == 1 && <ProfilePage selected={1} />}
        {selected == 2 && <OurDoctorAndPatients selected={1} />}
        {selected == 3 && <SystemMessagesPage />}
        {user?.role != 0 && user?.approved && selected == 4 && (
          <MyAppointments />
        )}

        {selected == 6 && user?.role == 1 && user.approved && (
          <OurDoctorAndPatients selected={2} />
        )}
        {selected == 5 && <Prescription />}
        {user?.role == 1 && user.approved && selected == 7 && (
          <ProfilePage selected={2} />
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
