import React, { useState } from "react";
import "./onedp.scss";
import { User } from "../../types/type";
import { useGetUserDoctorPatients } from "../../hooks/useGetUserDoctorPatients";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import PatientOrDoctor from "../PatientOrDoctor/PatientOrDoctor";
import { MdOutlineExpandMore } from "react-icons/md";
import { useGetAllDoctors } from "../../hooks/useGetAllDoctors";
import PrescriptionModal from "../PrescriptionModal/PrescriptionModal";
const OurDoctorAndPatients = ({ selected }: { selected: number }) => {
  const [patients, setPatients] = useState<User[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [moreDoctors, setMoreDoctors] = useState<User[] | null>([]);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [modalUser, setModalUser] = useState<User | null>(null);
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
      {modalUser ? (
        <div className="absoluteModal">
          <PrescriptionModal setUser={setModalUser} user={modalUser} />
        </div>
      ) : null}
      <header>{selected == 1 ? <h2>Doctors</h2> : <h2>Patients</h2>}</header>
      <div className="users">
        {selected == 1 ? (
          doctors.length == 0 ? (
            <p className="moreDoctorP"> You don't have doctors yet</p>
          ) : (
            doctors.map((doctor, index) => {
              return (
                <PatientOrDoctor
                  selected={selected}
                  isMore={false}
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
        ) : doctors.length == 0 ? (
          <p className="moreDoctorP"> You don't have Patients yet</p>
        ) : (
          patients.map((patient, index) => {
            return (
              <PatientOrDoctor
                status={false}
                selected={selected}
                setMoreDoctors={setMoreDoctors}
                user={patient}
                key={patient._id}
                setDoctors={setDoctors}
                index={index}
                canRemove={false}
                isMore={false}
                setModalUser={setModalUser}
              />
            );
          })
        )}
      </div>
      {moreDoctors && moreDoctors.length > 0 && (
        <p className="moreDoctorP">more doctors ({moreDoctors.length})</p>
      )}
      <div className="users">
        {moreDoctors?.map((moreDoctor, index) => {
          return (
            <PatientOrDoctor
              selected={selected}
              status={true}
              user={moreDoctor}
              index={index}
              key={moreDoctor._id}
              setDoctors={setDoctors}
              setMoreDoctors={setMoreDoctors}
              canRemove={true}
              isMore={true}
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

export default React.memo(OurDoctorAndPatients);
