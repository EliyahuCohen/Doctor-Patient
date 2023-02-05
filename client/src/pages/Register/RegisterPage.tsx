import "./app.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import { moveFoword, check } from "../../Utils/functions";
import { Register } from "../../types/type";
import { useRegister } from "../../hooks/useRegister";
const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [totalSteps, setTotalSteps] = useState<number>(4);
  const [error, setError] = useState<string>("");
  const [props, setProps] = useState<Register>({
    fName: "",
    lName: "",
    email: "",
    location: "",
    password: "",
    role: -1,
    speciality: "",
    isMale: true,
  });
  const { registerFunc } = useRegister(props, setError);

  return (
    <div className="register">
      <Link to="/" className="headlink">
        🔥Eden
      </Link>
      <div className="points">
        {[...new Array(totalSteps)].map((step, index) => {
          if (index + 1 > currentStep) {
            return (
              <div
                key={index}
                onClick={() => {
                  check(index);
                  moveFoword(index + 1, props, setCurrentStep);
                }}
              >
                {index + 1}
              </div>
            );
          }
          return (
            <div
              key={index}
              onClick={() => {
                check(index + 1);
                moveFoword(index + 1, props, setCurrentStep);
              }}
              className="selected"
            >
              {index + 1}
            </div>
          );
        })}
      </div>
      {currentStep == 1 ? (
        <div className="inputs">
          <div>
            <h1>Welcome! First things first...</h1>
            <p>You can always change them later.</p>
          </div>
          <div>
            <label htmlFor="fname">First Name</label>
            <input
              name="First Name"
              type="text"
              className="input1"
              value={props.fName}
              onChange={(e) => setProps({ ...props, fName: e.target.value })}
              required
              placeholder="Steve"
              pattern="^[a-zA-Z ]{3,30}$"
              id="fname"
            />
            <label htmlFor="lname">Last Name</label>
            <input
              className="input1"
              name="Last Name"
              type="text"
              placeholder="Jobs"
              required
              id="lname"
              pattern="^[a-zA-Z ]{3,30}$"
              value={props.lName}
              onChange={(e) => setProps({ ...props, lName: e.target.value })}
            />
            <button
              onClick={() => {
                if (check(1)) {
                  moveFoword(currentStep + 1, props, setCurrentStep);
                }
              }}
            >
              Create Workspace
            </button>
            <div className="links">
              <Link to="/signin">Do you have an account?</Link>
            </div>
          </div>
        </div>
      ) : currentStep == 2 ? (
        <div className="inputs">
          <div>
            <h1>Time for Email and Password</h1>
            <p>You can always change them later.</p>
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              className="input2"
              name="Email Address"
              type="email"
              required
              placeholder="someone@gmail.com"
              id="email"
              value={props.email}
              onChange={(e) => setProps({ ...props, email: e.target.value })}
            />
            <label htmlFor="pass">Password</label>
            <input
              name="Password (at least 8 charecters)"
              className="input2"
              type="password"
              placeholder="password"
              id="pass"
              required
              pattern="[A-Za-z\d@./!@#$%^&*({})]{8,}$"
              value={props.password}
              onChange={(e) => setProps({ ...props, password: e.target.value })}
            />
            <button
              onClick={() => {
                if (check(2)) {
                  moveFoword(currentStep + 1, props, setCurrentStep);
                }
              }}
            >
              Create Workspace
            </button>
          </div>
        </div>
      ) : currentStep == 3 ? (
        <div className="inputs">
          <div>
            <h1>How are you planing to use Eden?</h1>
            <p>We'll streamline your setup experience accordingly.</p>
          </div>
          <div className="roles">
            <label htmlFor="one" className="role ">
              <div className={props.role == 2 ? "selectedRole" : ""}>
                <span className="icon">🧑 </span>
                <span>As Patient</span>
                <p>whire better , think more clearly,Stay optemize</p>
              </div>
            </label>
            <input
              value={2}
              type="radio"
              defaultChecked
              required
              className="radio-btn input3"
              name="one"
              id="one"
              onChange={(e) =>
                setProps({ ...props, role: parseInt(e.target.value) })
              }
            />
            <label htmlFor="two" className="role">
              <div className={props.role == 1 ? "selectedRole" : ""}>
                <span className="icon">👨‍⚕️ </span>
                <span>As Doctor</span>
                <p>whire better , think more clearly,Stay optemize</p>
              </div>
            </label>
            <input
              value={1}
              required
              type="radio"
              className="radio-btn input3"
              name="one"
              id="two"
              onChange={(e) =>
                setProps({ ...props, role: parseInt(e.target.value) })
              }
            />
          </div>
          {props.role == 1 ? (
            <div className="options">
              <label htmlFor="spe">Speciality</label>
              <select
                value={props.speciality}
                onChange={(e) =>
                  setProps({ ...props, speciality: e.target.value })
                }
              >
                <option value="family-doctor">Family Doctor</option>
                <option value="optometrist">Optometrist</option>
                <option value="dermatologist">Dermatologist</option>
              </select>
            </div>
          ) : null}
          <div>
            <label htmlFor="loc">Location</label>
            <input
              className="input3"
              type="text"
              name="Location"
              pattern="^[a-zA-Z0-9\s,./ ]{3,30}$"
              value={props.location}
              onChange={(e) => setProps({ ...props, location: e.target.value })}
              required
              placeholder="New York"
              id="loc"
            />
          </div>
          <div>
            <div className="options">
              <label htmlFor="gender">Gender</label>
              <select
                defaultValue={"true"}
                onChange={(e) => {
                  setProps({
                    ...props,
                    isMale: e.target.value == "true" ? true : false,
                  });
                }}
              >
                <option value={"true"}>Male</option>
                <option value={"false"}>Female</option>
              </select>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                if (check(3)) {
                  moveFoword(currentStep + 1, props, setCurrentStep);
                }
              }}
            >
              Create Workspace
            </button>
          </div>
        </div>
      ) : (
        <div className="inputs finishSection">
          <div className="finish">✔</div>
          <div className="middle">
            <h1 className="small">Congratulations,{props.fName}!</h1>
            <p>You have completed onboarding, you can start using Eden</p>
          </div>

          <div>
            <button onClick={() => registerFunc()}>Create Workspace</button>
            {error != "" ? <span className="errorMessage">{error}</span> : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
