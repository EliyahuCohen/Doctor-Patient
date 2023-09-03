import "./resetPassword.scss";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useResetPassword } from "../../hooks/useResetPassword";
const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);
  const inputRefs = useRef<any>([]);
  const [error, setError] = useState<string>("");
  const [emailCheckError, setEmailCheckError] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { sendEmail, sendEmailAgain, ValidateVerficationCode, resetPassword } =
    useResetPassword(setStage);
  const handleFocus = (index: number) => () => {
    inputRefs.current[index].focus();
  };
  const handleChange = (e: any, index: number) => {
    const { value } = e.target;
    const newCode = value.replace(/\D/g, ""); // Remove non-digit characters
    setVerificationCode((prevCode) => {
      const newCodeArray = prevCode.split("");
      newCodeArray[index] = newCode;
      return newCodeArray.join("");
    });
    if (/^\d$/.test(value) && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    } else if (value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && index > 0 && !verificationCode[index]) {
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
                  sendEmail(email, setEmailCheckError);
                }
              }}
            >
              Reset password
            </button>
            {emailCheckError && (
              <p style={{ padding: "1rem 0.3rem" }} className="error">
                Email could not be found!
              </p>
            )}
            <div className="linkWrapper">
              <p className="goBackLink">
                <Link to="/signin">
                  <MdOutlineKeyboardBackspace style={{ marginRight: "1rem" }} />
                  Back to Sign in{" "}
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
              <button className="resetBtn">Open email app</button>
            </a>
            <p
              className="moveOnBtn"
              onClick={() => setStage((prev) => (prev + 1) as 1 | 2 | 3 | 4)}
            >
              Continue
            </p>
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
      ) : stage == 3 ? (
        <div className="emailFields">
          <div className="icon">
            <RiLockUnlockLine />
          </div>
          <div className="welcomeWords">
            <h2>Enter Verification Code</h2>
            <p>You're almost there one more step to go</p>
          </div>
          <div className="numbers-boxs">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                pattern="[0-9]"
                maxLength={1}
                value={verificationCode[index] || ""}
                onChange={(e) => handleChange(e, index)}
                onFocus={handleFocus(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputMode="numeric"
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>

          <button
            className="submitCode"
            onClick={() => {
              if (verificationCode.length == 6) {
                ValidateVerficationCode(email, verificationCode);
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
          <p className="resendP">
            Didn't receive the email?{" "}
            <button
              className="resendBtn"
              onClick={() => {
                if (check(1)) {
                  sendEmailAgain(email);
                }
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
      ) : (
        <div className="emailFields">
          <div className="forgotEmail">
            <div className="icon">
              <RiLockPasswordLine />
            </div>
            <div className="welcomeWords">
              <h2>Set new password</h2>
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
                  resetPassword(email, password).then(() =>
                    navigate("/signin")
                  );
                }
              }}
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
