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
import { motion } from "framer-motion";

const OurDoctorAndPatients = ({ selected }: { selected: number }) => {
  const [sortBy, setSortBy] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [speciality, setSpeciality] = useState<string>("");
  const uniqueSpecialities = new Set();
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
      {selected == 1 && doctors.length > 0 && (
        <div className="users filter">
          <b>Sort By</b>
          <select
            onChange={(e) => {
              if (["0", "1", "2", "3"].includes(e.target.value)) {
                setSortBy(parseInt(e.target.value) as 0 | 1 | 2 | 3 | 4);
              } else {
                setSpeciality(e.target.value);
                setSortBy(4);
              }
            }}
          >
            <option value="0">Default</option>
            <option value="1">Name</option>
            <option value="2">Rating</option>
            <option value="3">Meeting Duration</option>
            <optgroup label="Specialities" className="custom-optgroup">

              {doctors?.filter(d => d.speciality).map((doc) => {
                if (!uniqueSpecialities.has(doc.speciality)) {
                  uniqueSpecialities.add(doc.speciality);
                  return (
                    <option value={doc.speciality} key={doc._id}>
                      {doc.speciality}
                    </option>
                  );
                }
              }
              )}
            </optgroup>
          </select>
        </div>
      )}
      <motion.div layout className="users">
        {selected == 1 ? (
          doctors.length == 0 ? (
            <p className="moreDoctorP"> You don't have doctors yet</p>
          ) : (
            doctors
              .slice()
              .sort((one: any, two: User) => {
                if (sortBy === 1) {
                  return one.fName > two.fName ? one : two;
                }
                if (sortBy === 2) {
                  return one.userRating.sum / one.userRating.rating -
                    two.userRating.sum / two.userRating.rating <
                    1
                    ? 1
                    : -1;
                }
                if (sortBy === 3) {
                  return (
                    one.Duration.totalDuration / one.Duration.meetingsAmount -
                    two.Duration.totalDuration / two.Duration.meetingsAmount
                  );
                }
                return one;
              })
              .filter((one) => {
                if (sortBy === 4) {
                  if (one.speciality == speciality) {
                    return one;
                  } else {
                    return 0;
                  }
                } else {
                  return one;
                }
              })
              .reverse()
              .map((doctor, index) => {
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
        ) : patients.length == 0 ? (
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
      </motion.div>
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
