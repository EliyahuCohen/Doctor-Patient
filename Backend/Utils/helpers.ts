import jwt from "jsonwebtoken";
import validator from "validator";

export function createAccessToken(userId: string) {
  const token = jwt.sign({ userId }, `${process.env.SECRET}`, {
    expiresIn: "1d",
  });
  return token;
}
export function validateEmail(email: string) {
  return validator.isEmail(email);
}
export function validatePassword(password: string) {
  return validator.isStrongPassword(password);
}
export function ValidateEmailAndPassword(email: string, password: string) {
  if (!validateEmail(email)) throw Error("Invalid Email");
  else if (!validatePassword(password)) throw Error("Weak password");
}
export function generateVarificationCode(): string {
  return Math.floor(100_000 + Math.random() * 999_999).toString();
}
export function generateTokenForVarificationCode(code: string): string {
  const codeToken = jwt.sign({ code }, `${process.env.SECRET}`, {
    expiresIn: "10m",
  });
  return codeToken;
}
