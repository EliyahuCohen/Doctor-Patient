import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export function requiredAuthentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1];
  try {
    const { userId }: any = jwt.verify(token!, `${process.env.SECRET}`);
    req.body.USER_ID = userId;

    next();
  } catch (err) {
    res.status(429).json({ message: "Please sign in / signup" });
  }
}
