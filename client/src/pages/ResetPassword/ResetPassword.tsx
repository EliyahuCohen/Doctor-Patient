import "./resetPassword.scss";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import {
  RiKey2Line,
  RiLockPasswordLine,
  RiLockUnlockLine,
} from "react-icons/ri";
import { check } from "../../Utils/functions";
import { AiOutlineMail } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { newMessage } from "../../features/messagesSlice";
const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const inputRefs = useRef<any>([]);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();

  const handleFocus = (index: number) => () => {
    inputRefs.current[index].focus();
  };

  const handleChange = (e: any, index: number) => {
    const { value } = e.target;
    setVerificationCode((prevCode) => {
      const newCode = prevCode.split("");
      newCode[index] = value;
      return newCode.join("");
    });
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  return (
    <div className="resetWrapper">
      {stage == 1 ? (
        <div className="emailFields">
          <div className="forgotEmail">
            <div className="icon">
              <RiKey2Line />
            </div>
            <div className="welcomeWords">
              <h2>Forgot password?</h2>
              <p>No worries we'll send you reset instructions</p>
            </div>
            <label htmlFor="email">Email</label>
            <input
              className="input1"
              name="Email Address"
              type="email"
              required
              placeholder="Enter your email"
              autoComplete="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="resetBtn"
              onClick={() => {
                if (check(1)) {
                  setStage((prev) => 2);
                }
              }}
            >
              Reset password
            </button>
            <div className="linkWrapper">
              <p className="goBackLink">
                <Link to="/signin">
                  Back to Sign in{" "}
                  <MdOutlineKeyboardBackspace style={{ marginLeft: "1rem" }} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : stage == 2 ? (
        <div className="emailFields">
          <div className="forgotEmail">
            <div className="icon">
              <AiOutlineMail />
            </div>
            <div className="welcomeWords">
              <h2>Check your email</h2>
              <p>
                We sent a reset code to <br />{" "}
                <span className="userEmail">{email}</span>
              </p>
            </div>
            <a href="https://mail.google.com/" target="_blank">
              <button
                className="resetBtn"
                onClick={() => {
                  //we will automaticaly will navigate him to the last page after we get a signal that the mail was sent successfully
                }}
              >
                Open email app
              </button>
            </a>
            <div className="linkWrapper">
              <p className="resendP">
                Didn't recive the email?{" "}
                <button
                  className="resendBtn"
                  onClick={() => {
                    setStage((prev) => 3);
                  }}
                >
                  Click to resend
                </button>
              </p>
              <p className="goBackLink">
                <Link to="/signin">
                  Back to Sign in{" "}
                  <MdOutlineKeyboardBackspace style={{ marginLeft: "1rem" }} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      ) : stage == 3 ? (
        <div className="emailFields">
          <div className="icon">
            <RiLockUnlockLine />
          </div>
          <div className="welcomeWords">
            <h2>Enter Verification Code</h2>
            <p>We're almost threre one more step to go</p>
          </div>
          <div className="numbers-boxs">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={verificationCode[index] || ""}
                onChange={(e) => handleChange(e, index)}
                onFocus={handleFocus(index)}
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          <button
            className="submitCode"
            onClick={() => {
              if (verificationCode.length == 6) {
                //making the call here and moving him to the last step
                setStage((prev) => 4);
              } else {
                dispatch(
                  newMessage({
                    id: crypto.randomUUID(),
                    message: "Verfication code must be 6 digits long",
                    senderId: crypto.randomUUID(),
                    senderName: "System",
                    time: 3000,
                    type: "DELETE",
                  })
                );
              }
            }}
          >
            Apply
          </button>
          <p className="goBackLink">
            <Link to="/signin">
              Back to Sign in{" "}
              <MdOutlineKeyboardBackspace style={{ marginLeft: "1rem" }} />
            </Link>
          </p>
        </div>
      ) : (
        <div className="emailFields">
          <div className="forgotEmail">
            <div className="icon">
              <RiLockPasswordLine />
            </div>
            <div className="welcomeWords">
              <h2>Set new password</h2>
              <p>
                Your new password must be diffrent to <br /> previously used
                passwords
              </p>
            </div>
            <div className="finalInputs">
              <label htmlFor="fpassword">Password</label>
              <input
                className="input6"
                name="Password"
                type="password"
                required
                placeholder="Enter your password"
                autoComplete="password"
                id="fpassword"
                value={password}
                pattern="[A-Za-z\d@./!@#$%^&*({})]{8,}$"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="cpassword">Confirm password</label>
              <input
                className="input6"
                name="Password"
                type="password"
                required
                placeholder="Reenter your password"
                autoComplete="password"
                id="cpassword"
                value={confirmPassword}
                pattern="[A-Za-z\d@./!@#$%^&*({})]{8,}$"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              className="resetBtn"
              onClick={(e) => {
                if (!check(6)) {
                  setError("Invalid password ");
                }
                if (password !== confirmPassword) {
                  setError("passwords are not the same");
                } else {
                  setError("");
                  //making a call to realy change the password
                }
              }}
              //we will automaticaly will navigate him to the last page after we get a signal that the mail was sent successfully
            >
              Reset password
            </button>
            {error ? <p className="errorMessage">{error}</p> : null}
            <div className="linkWrapper">
              <p className="goBackLink">
                <Link to="/signin">
                  Back to Sign in{" "}
                  <MdOutlineKeyboardBackspace style={{ marginLeft: "1rem" }} />
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ResetPassword);
