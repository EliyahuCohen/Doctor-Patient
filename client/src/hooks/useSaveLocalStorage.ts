import { useDispatch } from "react-redux";
import { socket } from "../App";
import { setUser, UserType } from "../features/userSlice";
export function useSaveLocalStorage() {
  const dispatch = useDispatch();

  function saveLocalStorage(user: UserType) {}
  function createIfDontHave() {
    if (
      localStorage.getItem("user") == null ||
      localStorage.getItem("user") == undefined ||
      localStorage.getItem("user") == "null" ||
      localStorage.getItem("user") == "undefined"
    ) {
      localStorage.setItem("user", JSON.stringify(null));
    } else {
      dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
      socket.emit(
        "userConnected",
        JSON.parse(localStorage.getItem("user")!).user
      );
    }
  }
  return { saveLocalStorage, createIfDontHave };
}
