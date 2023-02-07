import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { UserType } from "../../features/userSlice";
import "./app.scss";
const Navbar = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  return (
    <nav>
      <div className="navbar">
        <div>
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

              <p className="specialLink">{user.fName}</p>
            </div>
          )}
          <NavLink className="setting" to="/">
            ⚙️
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
