import React, { useState } from 'react'
import "./resetPassword.scss"

const ResetPassword = () => {
  const [email,setEmail]=useState("")
  const [verificationCode,setVerificationCode]=useState("")
  const [password,setPassword]=useState("")
  return (
    <div className='resetWrapper'></div>
  )
}

export default React.memo(ResetPassword) 