import { useState } from "react";
import "./app.scss";
import { User } from "../../types/type";
import { useGetUserDoctorPatients } from "../../hooks/useGetUserDoctorPatients";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import PatientOrDoctor from "../PatientOrDoctor/PatientOrDoctor";
import { MdOutlineExpandMore } from "react-icons/md";
import { useGetAllDoctors } from "../../hooks/useGetAllDoctors";
const OurDoctorAndPatients = ({ selected }: { selected: number }) => {
  const [patients, setPatients] = useState<User[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [moreDoctors, setMoreDoctors] = useState<User[] | null>([]);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const { getDoctors } = useGetAllDoctors(setMoreDoctors);
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  function getMoreDoctors() {
    getDoctors(doctors, setIsFetched);
  }
  useGetUserDoctorPatients(setDoctors, setPatients, token);
  return (
    <div className="allUsers">
      <header>{selected == 1 ? <h2>Doctors</h2> : <h2>Patients</h2>}</header>
      <div className="users">
        {selected == 1 ? (
          doctors.length == 0 ? (
            <p className="moreDoctorP"> You don't have doctors yet</p>
          ) : (
            doctors.map((doctor, index) => {
              return (
                <PatientOrDoctor
                  status={false}
                  user={doctor}
                  key={doctor._id}
                  setDoctors={setDoctors}
                  setMoreDoctors={setMoreDoctors}
                  canRemove={true}
                  index={index}
                />
              );
            })
          )
        ) : (
          patients.map((patient, index) => {
            return (
              <PatientOrDoctor
                status={false}
                user={patient}
                key={patient._id}
                setDoctors={setDoctors}
                setMoreDoctors={setMoreDoctors}
                index={index}
                canRemove={false}
              />
            );
          })
        )}
      </div>
      {moreDoctors && moreDoctors.length > 0 && (
        <p className="moreDoctorP">more doctors ({moreDoctors.length})</p>
      )}
      <div className="users">
        {moreDoctors?.map((doctor, index) => {
          return (
            <PatientOrDoctor
              status={true}
              user={doctor}
              index={index}
              key={doctor._id}
              setDoctors={setDoctors}
              setMoreDoctors={setMoreDoctors}
              canRemove={true}
            />
          );
        })}
      </div>
      {selected == 1 && !isFetched ? (
        <div className="moreDoctors">
          <button onClick={getMoreDoctors}>
            Browse more doctors
            <MdOutlineExpandMore style={{ marginLeft: "0.4rem" }} />
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default OurDoctorAndPatients;
