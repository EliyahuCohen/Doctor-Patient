import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { UserType } from "../../features/userSlice";
import { AiOutlineMail } from "react-icons/ai";
import { logout } from "../../features/userSlice";
import "./nav.scss";
import { socket } from "../../App";
import { useEffect, useState } from "react";
import { newMessage } from "../../features/messagesSlice";
import { MdOutlineLogout } from "react-icons/md";
const Navbar = () => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  function check() {
    if (window.innerWidth > 650) setOpen(false);
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    const height = window.addEventListener("resize", check);
  }, []);
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
            <h1 className="fire">
              🔥 <span>HealthEase</span>
            </h1>
          </NavLink>
        </div>
        {width > 650 ? (
          <div className="navLinks">
            {!user ? (
              <>
                <NavLink className="link" to="/signin" title="Login page">
                  Login
                </NavLink>
                <NavLink className="link" to="/register" title="Signup page">
                  Signup
                </NavLink>
              </>
            ) : (
              <div className="flex">
                {user.role == 0 ? (
                  <>
                    <NavLink
                      className="link"
                      to="/admin"
                      title="Dashboard page"
                    >
                      Dashboard
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      className="link"
                      to="/dashboard"
                      title="Dashboard page"
                    >
                      Dashboard
                    </NavLink>
                  </>
                )}
              </div>
            )}
            {user ? (
              <p
                title="logout"
                style={{ padding: "0 1rem", cursor: "pointer" }}
                onClick={() => {
                  localStorage.setItem("user", JSON.stringify(null));
                  dispatch(logout());
                  dispatch(
                    newMessage({
                      id: crypto.randomUUID(),
                      message: "User Logged Out",
                      senderId: crypto.randomUUID(),
                      senderName: "System",
                      time: 3000,
                      type: "SYSTEM",
                    })
                  );
                  socket.emit("userLoggedOut");
                }}
              >
                <MdOutlineLogout style={{ fontSize: "larger" }} />
              </p>
            ) : null}
          </div>
        ) : (
          <div>
            <button
              title="Open Side Menu"
              onClick={() => setOpen((prev) => !prev)}
              className="hamBtn"
            >
              🍔
            </button>
          </div>
        )}
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="openMenu"
          >
            <button
              title="Open Side Menu"
              onClick={() => setOpen((prev) => !prev)}
              className="hamBtn"
            >
              🍔
            </button>
            {!user ? (
              <>
                <NavLink
                  onClick={() => setOpen(false)}
                  className="link"
                  to="/signin"
                  title="Login page"
                >
                  Login
                </NavLink>
                <NavLink
                  onClick={() => setOpen(false)}
                  className="link"
                  to="/register"
                  title="Signup page"
                >
                  Signup
                </NavLink>
              </>
            ) : (
              <div className="flex">
                {user.role == 0 ? (
                  <>
                    <NavLink
                      onClick={() => setOpen(false)}
                      className="link"
                      to="/admin"
                      title="Dashboard page"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      onClick={() => setOpen(false)}
                      className="link"
                      to="/profile"
                      title="Profile page"
                    >
                      <p className="specialLink">{user.fName}</p>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      onClick={() => setOpen(false)}
                      className="link"
                      to="/dashboard"
                      title="Dashboard page"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      onClick={() => setOpen(false)}
                      className="link"
                      to="/profile"
                      title="Profile page"
                    >
                      <p className="specialLink" title="Profile">
                        {user.fName}
                      </p>
                    </NavLink>
                  </>
                )}
              </div>
            )}
            {user ? (
              <p
                title="logout"
                style={{ padding: "0 1rem", cursor: "pointer" }}
                onClick={() => {
                  localStorage.setItem("user", JSON.stringify(null));
                  dispatch(logout());
                  socket.emit("userLoggedOut");
                  setOpen(false);
                }}
              >
                <MdOutlineLogout />
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </div>
    </motion.nav>
  );
};

export default Navbar;
