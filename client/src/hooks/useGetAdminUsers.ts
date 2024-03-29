import axios from "axios";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { useDispatch } from "react-redux";
import {
  setAdminUsers,
  setLiveUsersObject,
  updateLiveUsers,
} from "../features/adminSlice";
export function useGetAdminUsers() {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const dispatch = useDispatch();
  async function getUsers() {
    const instance = axios.create({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    instance
      .get("http://localhost:3001/users/all")
      .then((res) => {
        dispatch(setAdminUsers(res.data.users));
        dispatch(setLiveUsersObject(res.data.usersId));
        dispatch(updateLiveUsers(res.data.usersId));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return { getUsers };
}
