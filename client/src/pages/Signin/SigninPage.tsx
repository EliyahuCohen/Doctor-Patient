import { useState } from "react";
import { Link } from "react-router-dom";
import { Login } from "../../types/type";
import { check } from "../../Utils/functions";
import { useLogin } from "../../hooks/useLogin";
import "./app.scss";
const SigninPage = () => {
  const [myError, setMyError] = useState<string>("");
  const [user, setUser] = useState<Login>({
    email: "",
    password: "",
  });
  const { loginFunc } = useLogin(user, setMyError);
  return (
    <div className="wrapper">
      <div>
        <h1>Welcome back</h1>
        <div className="btn">
          <img
            src="https://www.vectorlogo.zone/logos/google/google-icon.svg"
            alt=""
          />
          Sign in with Google
        </div>
        <div className="or">
          <p>or</p>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="input5"
            name="Email Address"
            type="email"
            required
            placeholder="someone@gmail.com"
            id="email"
          />
          <label htmlFor="pass">Password</label>
          <input
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            name="Password (at least 8 charecters)"
            className="input5"
            type="password"
            placeholder="password"
            id="pass"
            required
            pattern="[A-Za-z\d@./!@#$%^&*({})]{8,}$"
          />
        </div>
        <div>
          <button
            className="click"
            onClick={()=>{
              if(check(5)){
                loginFunc()
              }else{
                setMyError("")
              }
            }}
          >
            Login in
          </button>
          <div className="error">{myError}</div>
        </div>
        <div className="links">
          <Link to="/register">Don't have an account?</Link>
          <Link to="/">Forgot Password?</Link>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
