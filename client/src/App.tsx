import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./app.css";
import AdminPage, { socket } from "./pages/Admin/AdminPage";
import Navbar from "./components/Navbar/Navbar";
import { UserType } from "./features/userSlice";
import RegisterPage from "./pages/Register/RegisterPage";
import SigninPage from "./pages/Signin/SigninPage";
import { useEffect } from "react";
const App = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("userConnected", { id: socket.id, status: "online" });
    });

    socket.on("disconnect", () => {
      socket.emit("userDisconnected", { id: socket.id, status: "offline" });
    });
  }, []);
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={user ? <></> : <Navigate to="/signin" />} />
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
