import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "../../types/type";
import { check } from "../../Utils/functions";
import { useLogin } from "../../hooks/useLogin";
import "./signin.scss";
import { useDispatch } from "react-redux";
import { newMessage } from "../../features/messagesSlice";
const SigninPage = () => {
  const dispatch = useDispatch();
  const [myError, setMyError] = useState<string>("");
  const [User, setUser] = useState<Login>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { loginFunc } = useLogin();
  return (
    <div className="wrapper">
      <div>
        <h1>Welcome back </h1>

        {/* <div
          className="btn"
          onClick={() =>
            dispatch(
              newMessage({
                id: crypto.randomUUID(),
                message: "Sorry the service is not available",
                senderId: crypto.randomUUID(),
                senderName: "System",
                time: 5000,
                type: "DELETE",
              })
            )
          }
        >
          <img
            src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
            alt="google sign in image"
          />
          Sign in with Google
        </div> */}
        <div className="or">
          <p> </p>
          <span></span>
        </div>
        <form>
          <label htmlFor="email">Email</label>
          <input
            value={User.email}
            onChange={(e) => setUser({ ...User, email: e.target.value })}
            className="input5"
            name="Email Address"
            type="email"
            required
            placeholder="someone@gmail.com"
            autoComplete="email"
            id="email"
          />
          <label htmlFor="password">Password</label>
          <input
            value={User.password}
            autoComplete="current-password"
            onChange={(e) => setUser({ ...User, password: e.target.value })}
            name="Password (at least 8 charecters)"
            className="input5"
            type="password"
            placeholder="password"
            id="password"
            required
            pattern="[A-Za-z\d@./!@#$%^&*({})]{8,}$"
          />
        </form>
        <div>
          <button
            className="click"
            onClick={() => {
              if (check(5)) {
                loginFunc(User, setMyError).then((res) => {
                  res.user.role == 0
                    ? navigate("/admin")
                    : navigate("/dashboard/0");
                });
              } else {
                setMyError("");
              }
            }}
          >
            Log in
          </button>
          <div className="error">{myError}</div>
        </div>
        <div className="links">
          <Link to="/register">Don't have an account?</Link>
          <Link to="/reset-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
