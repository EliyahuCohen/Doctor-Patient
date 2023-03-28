import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { Suspense } from "react";
import "./app.css";
import Navbar from "./components/Navbar/Navbar";
import { UserType } from "./features/userSlice";
import { useEffect } from "react";
import { adminUsers } from "./features/adminSlice";
import { useSaveLocalStorage } from "./hooks/useSaveLocalStorage";
import Messages from "./components/Messages/Messages";
import routes, { RouteType } from "./Pathes";
import { CircularProgress } from "@mui/material";
import { handleSocket, sendMessageTime, updateStatus } from "./Utils/functions";

export const socket = io("http://localhost:3001");

const App = () => {
  const { createIfDontHave } = useSaveLocalStorage();
  const dispatch = useDispatch();
  const date = new Date();
  const { users } = useSelector(
    (state: { adminSlice: adminUsers }) => state.adminSlice
  );
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  useEffect(() => {
    sendMessageTime(dispatch);
    createIfDontHave();
  }, []);
  useEffect(() => {
    updateStatus(socket, dispatch, user);
  }, [socket, user, users.length]);
  useEffect(() => {
    handleSocket(socket, dispatch);
  }, [socket]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Router>
        <Suspense fallback={<CircularProgress />}>
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
        </Suspense>
      </Router>
    </div>
  );
};

export default App;
