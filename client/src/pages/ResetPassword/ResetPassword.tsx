import "./resetPassword.scss"
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineKeyboardBackspace } from "react-icons/md"
import { RiKey2Line } from "react-icons/ri"
const ResetPassword = () => {
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [stage, setState] = useState<1 | 2 | 3 | 4>(1)
  return (
    <div className='resetWrapper'>
      {stage == 1 ? <div className='emailFields'>
        <div className='forgotEmail'>
          <div className="icon">
            <RiKey2Line />
          </div>
          <div className='welcomeWords'>
            <h2>Forgot password?</h2>
            <p>No worries we'll send you reset instructions</p>
          </div>
          <label htmlFor="email">Email</label>
          <input type="email" placeholder='Enter your email' value={email} onChange={e => setEmail(e.target.value)} id='email' />
          <button className='resetBtn'>Reset password</button>
          <div className='linkWrapper'>
            <p className='goBackLink'>
              <Link to="/signin">Back to Sign in <MdOutlineKeyboardBackspace style={{ marginLeft: "1rem" }} /></Link>
            </p>
          </div>
        </div>
      </div> : null}
    </div>
  )
}

export default React.memo(ResetPassword) 