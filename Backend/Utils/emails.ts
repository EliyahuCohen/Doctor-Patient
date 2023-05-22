export function resetPasswordEmail(
  email: string,
  varificationCode: string
): string {
  return `<!DOCTYPE html>
    <body
    style="
      margin: 0;
      padding: 0;
      font-family: 'Roboto', sans-serif;
      box-sizing: border-box;
      text-align:center;
    "
  >
    <div
      style="
        margin: 0 auto;
        padding: 1rem;
        border: 2px solid #333;
        border-radius: 15px;
        width: 400px;
        height:fit-content;
      "
    >
      <div
        style="display: flex;  flex-direction: column !importent" justify-content: center;
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Message_%28Send%29.png"
          alt="the message image"
          style="
            width: 100%;
            object-fit: contain;
            max-width: 100px;
            max-height: 100px;
            margin: 0 auto;
          "
        />
        <h1 style="text-align: center; font-size: 1.2em">Verification Code</h1>
        <strong style="text-align: center; margin-top: 1rem"
          >Dear ${email.split("@")[0]}</strong
        >
        <p style="text-align: center; margin-top: 1rem">
          We received a request to reset the password for your account at
          eliyahu@gmail.com. To proceed with the password reset,<br /><br />
          Please enter this code within <strong>10 minutes</strong> on the
          password reset page. If you didn't initiate this request, please
          disregard this email.
        </p>
        <p style="text-align: center; margin-top: 1rem">
          This is your verification code
        </p>
        <div
          style="
            display: flex;
            justify-content: center;
            margin-top: 2rem;
            padding: 0.4rem 2rem;
            border: 2px solid lightblue;
            border-radius: 100vh;
            width: fit-content;
            margin: 1rem auto;
          "
        >
          ${varificationCode}
        </div>
      </div>
    </div>
  </body>`;
}
