import axios from "axios";
export function useUser() {
  async function validateEmail(
    email: string,
    setEmailError: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<boolean> {
    return axios
      .post("http://localhost:3001/users/validateEmail", {
        email,
      })
      .then((res) => {
        setEmailError(false);
        return false;
      })
      .catch((err) => {
        setEmailError(true);
        return true;
      });
  }

  return { validateEmail };
}
