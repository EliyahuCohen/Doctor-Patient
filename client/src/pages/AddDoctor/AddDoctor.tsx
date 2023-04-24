import "./app.scss";
import { useEffect, useState } from "react";
import { User } from "../../types/type";
import { useGetAllDoctors } from "../../hooks/useGetAllDoctors";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { MdPersonRemove } from "react-icons/md";
import { MdPersonAddAlt1 } from "react-icons/md";
import { useUpdateDoctorList } from "../../hooks/useUpdateDoctorList";
const AddDoctor = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const [doctors, setDoctors] = useState<User[] | null>(null);
  const [specialties, setSpecialities] = useState<string[]>([]);
  const [selected, setSelected] = useState<number>(0);
  const { getDoctors } = useGetAllDoctors(setDoctors, setSpecialities);
  const { updateList } = useUpdateDoctorList();
  const { listOfDoctors } = user as User;
  useEffect(() => {
    getDoctors();
  }, []);
  return (
    <div className="addDoctorWrraper">
      <p className="doctosTitle">
        Manage You'r health with <span>Our doctors</span>
      </p>
      <div className="titles">
        <p
          className={selected == 0 ? "selected" : ""}
          onClick={() => setSelected(0)}
        >
          All
        </p>
        {specialties?.map((spe: string, index: number) => {
          return (
            <p
              className={selected == index + 1 ? "selected" : ""}
              onClick={() => setSelected(index + 1)}
              key={spe}
            >
              {spe}
            </p>
          );
        })}
      </div>
      <div className="usersList">
        {doctors?.map((doc: User) => {
          if (
            (doc.speciality == specialties[selected - 1] &&
              doc._id != user?._id) ||
            (selected == 0 && doc._id != user?._id)
          ) {
            return (
              <div className="userRow" key={doc._id}>
                <span className="type">👨‍⚕️</span>
                <strong className="email">{doc.email}</strong>
                <p>{doc.speciality}</p>
                <p>{doc.fName + " " + doc.lName}</p>
                <p className="type">{doc.location}</p>
                <div className="btns">
                  {listOfDoctors.includes(doc._id) ? (
                    <button
                      title={"remove doctor"}
                      onClick={() => updateList(doc._id)}
                    >
                      <MdPersonRemove className="icon" fontSize="medium" />
                    </button>
                  ) : (
                    <button
                      title={"add doctor"}
                      onClick={() => updateList(doc._id)}
                    >
                      <MdPersonAddAlt1 className="icon" fontSize="medium" />
                    </button>
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default AddDoctor;
