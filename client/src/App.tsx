import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { io } from "socket.io-client";
import "./app.css";
import AdminPage from "./pages/Admin/AdminPage";
import Navbar from "./components/Navbar/Navbar";
import { UserType } from "./features/userSlice";
import RegisterPage from "./pages/Register/RegisterPage";
import SigninPage from "./pages/Signin/SigninPage";
import { useEffect } from "react";
import { User } from "./types/type";
import {
  adminUsers,
  updateLiveUsers,
  updateStateLive,
  removeLiveUser,
} from "./features/adminSlice";
import HomePage from "./pages/Home/HomePage";
import { useSaveLocalStorage } from "./hooks/useSaveLocalStorage";
import ProfilePage from "./pages/Profile/ProfilePage";
import OneProfile from "./pages/OneProfile/OneProfile";
import UserDashboardPage from "./pages/UserDashboard/UserDashboardPage";
import Communication from "./pages/CommunicationPage/Communication";
import { SystemMessagesPage } from "./pages";
import { newMessage } from "./features/messagesSlice";
import AddDoctor from "./pages/AddDoctor/AddDoctor";
import Messages from "./components/Messages/Messages";
import routes, { RouteType } from "./Pathes";
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
        <>
          <Navbar />
          <Messages />
        </>
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
