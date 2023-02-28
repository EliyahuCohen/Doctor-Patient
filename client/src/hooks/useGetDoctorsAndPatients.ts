import { User } from "../types/type";
import axios from "axios";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
export function useGetDoctorsAndPatients(
  setUserDoctors: React.Dispatch<React.SetStateAction<User[]>>,
  setPatients: React.Dispatch<React.SetStateAction<User[]>>,
  theUser: User | null
) {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  function getInfo() {
    const doctorsArray: User[] = [];
    const patientArray: User[] = [];
    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    for (let i = 0; i < theUser!.listOfDoctors.length; i++) {
      instance
        .get(`http://localhost:3002/users/one/${theUser!.listOfDoctors[i]}`)
        .then((res) => {
          setUserDoctors((prev) => [...prev, res.data]);
          doctorsArray.push(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      setPatients(patientArray);
    }
    if (theUser!.role == 1 || theUser!.role == 0) {
      for (let i = 0; i < theUser!.listOfPatients.length; i++) {
        instance
          .get(`http://localhost:3002/users/one/${theUser!.listOfPatients[i]}`)
          .then((res) => {
            setPatients((prev) => [...prev, res.data]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }
  return { getInfo };
}
