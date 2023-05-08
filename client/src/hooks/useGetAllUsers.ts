import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { User } from "../types/type";
export function useGetAllUsers() {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  async function getUsers(
    setUsers: React.Dispatch<React.SetStateAction<User[]>>
  ) {
    instance
      .get(`http://localhost:3001/users/all`)
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return { getUsers };
}
