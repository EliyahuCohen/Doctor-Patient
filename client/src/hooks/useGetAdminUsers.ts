import axios from "axios";
import React from "react";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
import { User } from "../types/type";
import { useDispatch } from "react-redux";
import { setAdminUsers } from "../features/adminSlice";
export function useGetAdminUsers() {
  const { user, token } = useSelector(
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
        dispatch(
          setAdminUsers(
            res.data.map((element: User) => {
              element.live = false;
              return element;
            })
          )
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return { getUsers };
}
