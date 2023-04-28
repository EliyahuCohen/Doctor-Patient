import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { Suspense } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import { UserType } from "./features/userSlice";
import { useEffect } from "react";
import { adminUsers } from "./features/adminSlice";
import { useSaveLocalStorage } from "./hooks/useSaveLocalStorage";
import Messages from "./components/Messages/Messages";
import routes, { RouteType } from "./Pathes";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { handleSocket, sendMessageTime, updateStatus } from "./Utils/functions";
import { useLogin } from "./hooks/useLogin";

export const socket = io("http://localhost:3001");

const App = () => {
  const { createIfDontHave } = useSaveLocalStorage();
  const { checkTokenValidity } = useLogin();
  const dispatch = useDispatch();
  const date = new Date();
  const { users } = useSelector(
    (state: { adminSlice: adminUsers }) => state.adminSlice
  );
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  useEffect(() => {
    checkTokenValidity();
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
        <Suspense fallback={<AiOutlineLoading3Quarters />}>
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
