import Meet from "./Models/Meeting.model";
import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./Routes/User.route";
import meetRouter from "./Routes/Meet.route";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

//setting and setups
mongoose.set("strictQuery", true);
const app: Application = express();
const server = http.createServer(app);
export const socket = new Server(server);

socket.on("connection", (socket) => {
  console.log("A user connected");
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/users", userRouter);
app.use("/meeting", meetRouter);

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() =>
    server.listen(process.env.PORT, () => {
      console.log(`conncted to db and running on port ${process.env.PORT}`);
    })
  )
  .catch((err) => console.log(err));
