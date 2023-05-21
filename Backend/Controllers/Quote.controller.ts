import { Request, Response } from "express";
import { medicalQuotes } from "../Utils/quoutes";

export function getQuote(req: Request, res: Response) {
  return res
    .status(200)
    .json(medicalQuotes[Math.floor(Math.random() * medicalQuotes.length)]);
}
