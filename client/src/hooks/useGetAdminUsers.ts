import axios from "axios"
import { User } from "../types/type";
export function useGetAdminUsers(
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
) {
  async function getUsers() {
   
  }
  return { getUsers };
}
