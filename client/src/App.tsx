import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./app.css";
import AdminPage from "./pages/Admin/AdminPage";
import Navbar from "./components/Navbar/Navbar";
import { UserType } from "./features/userSlice";
import RegisterPage from "./pages/Register/RegisterPage";
import SigninPage from "./pages/Signin/SigninPage";
const App = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );

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
