import express from "express";
import { getQuote } from "../Controllers/Quote.controller";

const router = express.Router();

router.get("/get-quoute", getQuote);

export default router;
