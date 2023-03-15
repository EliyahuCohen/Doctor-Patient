import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import "./app.css";
import Navbar from "./components/Navbar/Navbar";
import { UserType } from "./features/userSlice";
import { useEffect } from "react";
import { User } from "./types/type";
import {
  adminUsers,
  updateLiveUsers,
  updateStateLive,
  removeLiveUser,
} from "./features/adminSlice";
import { useSaveLocalStorage } from "./hooks/useSaveLocalStorage";
import { newMessage } from "./features/messagesSlice";
import Messages from "./components/Messages/Messages";
import routes, { RouteType } from "./Pathes";
import { updateRole } from "./features/userSlice";

export const socket = io("http://localhost:3001");

const App = () => {
  const { createIfDontHave } = useSaveLocalStorage();
  const dispatch = useDispatch();

  const { users } = useSelector(
    (state: { adminSlice: adminUsers }) => state.adminSlice
  );
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  useEffect(() => {
    createIfDontHave();
  }, []);
  useEffect(() => {
    socket.on("userLoggedIn", (sock: User) => {
      dispatch(updateStateLive(sock));
    });

    if (user?.role == 0) {
      dispatch(updateLiveUsers());
    }
  }, [socket, user, users.length]);
  useEffect(() => {
    socket.on("updateAdmin", (res) => {
      dispatch(removeLiveUser(res));
    });
    socket.on(
      "isApprove",
      (sock: {
        approve: boolean;
        message: { message: string; type: 1 | 2 | 3 };
      }) => {
        const { type } = sock.message;
        dispatch(updateRole(sock.approve));
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: sock.message.message,
            senderName: "Admin",
            type: type == 1 ? "MESSAGE" : "DELETE",
            time: 2000,
            senderId: crypto.randomUUID(),
          })
        );
      }
    );
    socket.on("messageSent", (sock: any) => {
      if (!window.location.pathname.includes("communication")) {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: sock.message,
            senderName: sock.senderName,
            type: "MESSAGE",
            time: 2000,
            senderId: crypto.randomUUID(),
          })
        );
      }
    });
  }, [socket]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Router>
        <Messages />
        <Navbar />
        <Routes>
          {routes.map((route: RouteType) => {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  typeof route.element === "function" ? (
                    <route.element user={user} />
                  ) : (
                    route.element
                  )
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
};

export default App;
