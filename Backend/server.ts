import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./Routes/User.route";
import meetRouter from "./Routes/Meet.route";
import http from "http";
import { Server } from "socket.io";
dotenv.config();

export let usersID: any[] = [];

//setting and setups
mongoose.set("strictQuery", true);
const app: Application = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });
const usersArr: any[] = [];

io.on("connection", (socket) => {
  socket.on("userConnected", (data: any) => {
    if (data._id != undefined) {
      usersArr.push({ userId: data._id, socketId: socket.id });
    }
    console.log(usersArr);
    socket.emit("updateAdmin", data);
  });

  socket.on("disconnect", () => {
    usersArr.splice(
      usersArr.findIndex((u) => u.socketId == socket.id),
      1
    );
    console.log("user left", usersArr);
    socket.emit("updateAdmin", usersArr);
  });
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
