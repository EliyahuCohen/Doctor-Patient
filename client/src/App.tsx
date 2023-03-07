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
import { useEffect, useState } from "react";
import { IMessage, User } from "./types/type";
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
import Message from "./components/Message/Message";
import { SystemMessagesPage } from "./pages";
import { messagesType, newMessage } from "./features/messagesSlice";

export const socket = io("http://localhost:3001");

const App = () => {
  const { createIfDontHave } = useSaveLocalStorage();
  const dispatch = useDispatch();

  const { users } = useSelector(
    (state: { adminSlice: adminUsers }) => state.adminSlice
  );
  const { messages } = useSelector(
    (state: { messagesSlice: messagesType }) => state.messagesSlice
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
          <div className="messagesWrapper">
            <div className="abs">
              {messages.map((message: IMessage) => {
                return <Message key={message.id} {...message} />;
              })}
            </div>
          </div>
        </>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={
              user != null && user?.role == 0 ? (
                <AdminPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user != null && user.approved ? (
                <ProfilePage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile/:id"
            element={user != null ? <OneProfile /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={user != null ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route
            path="/signin"
            element={user != null ? <Navigate to="/" /> : <SigninPage />}
          />
          <Route
            path="/dashboard"
            element={
              user != null && user.approved ? (
                <UserDashboardPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/communication/:userid"
            element={
              user != null && user.approved ? (
                <Communication />
              ) : (
                <Navigate to="/not-allowed" />
              )
            }
          />
          <Route
            path="/system-messages"
            element={
              user != null && user.role != 0 ? (
                <SystemMessagesPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
