import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./Routes/User.route";
import meetRouter from "./Routes/Meet.route";
import messagesRouter from "./Routes/Conversation.route";
import http from "http";
import { Server } from "socket.io";
import { socket } from "./socket";
export interface user {
  userId: mongoose.Types.ObjectId;
  socketId: string;
}

dotenv.config();
mongoose.set("strictQuery", true);
const app: Application = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/users", userRouter);
app.use("/meeting", meetRouter);
app.use("/messages", messagesRouter);

mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() =>
    server.listen(process.env.PORT, () => {
      console.log(`connected to db and running on port ${process.env.PORT}`);
      socket(io);
    })
    )
    .catch((err) => console.log(err));
    