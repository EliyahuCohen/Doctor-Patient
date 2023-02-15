import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { UserType } from "../../features/userSlice";
import { logout } from "../../features/userSlice";
import "./app.scss";
import { socket } from "../../App";
const Navbar = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const dispatch = useDispatch();
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar">
        <div className="leftNav">
          <NavLink to="/">
            <h1>🔥 Eden</h1>
          </NavLink>
        </div>
        <div className="navLinks">
          {!user ? (
            <>
              <NavLink className="link" to="/signin">
                Login
              </NavLink>
              <NavLink className="link" to="/register">
                Signup
              </NavLink>
            </>
          ) : (
            <div className="flex">
              {user.role == 0 ? (
                <NavLink className="link" to="/admin">
                  Dashboard
                </NavLink>
              ) : null}
              <NavLink className="link" to="/profile">
                Profile
              </NavLink>
              <p className="specialLink">{user.fName}</p>
            </div>
          )}
          {user ? (
            <p
              title="logout"
              style={{ padding: "0 1rem", cursor: "pointer" }}
              onClick={() => {
                localStorage.setItem("user", JSON.stringify(null));
                dispatch(logout());
              }}
            >
              👋
            </p>
          ) : null}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
