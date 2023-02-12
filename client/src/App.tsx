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
import { setUser, UserType } from "./features/userSlice";
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

export const socket = io("http://localhost:3001");

const App = () => {
  const dispatch = useDispatch();
  const { users } = useSelector(
    (state: { adminSlice: adminUsers }) => state.adminSlice
  );
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );

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
  }, [socket]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route
            path="/signin"
            element={user ? <Navigate to="/" /> : <SigninPage />}
          />
          <Route
            path="/admin"
            element={
              user && user.role == 0 ? <AdminPage /> : <Navigate to="/" />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
