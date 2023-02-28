import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose, { ObjectId } from "mongoose";
import userRouter from "./Routes/User.route";
import meetRouter from "./Routes/Meet.route";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
export interface user {
  userId: ObjectId;
  socketId: string;
}

export let usersID: user[] = [];

//setting and setups
mongoose.set("strictQuery", true);
const app: Application = express();
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("userConnected", (data: any) => {
    console.log(data);
    if (data._id && socket) {
      if (data.role !== 0) {
        usersID.push({ userId: data._id, socketId: socket.id });
      }
      io.emit("userLoggedIn", data);
    }
  });
  socket.on("newUser", (id) => {
    usersID.push({ userId: id, socketId: socket.id });
  });
  socket.on("disconnect", () => {
    let selected = usersID.filter((one) => one.socketId == socket.id)[0];
    usersID = usersID.filter((one) => one.socketId !== socket.id);
    if (selected) {
      io.emit("updateAdmin", selected.userId);
    }
  });
  socket.on("userLoggedOut", () => {
    let selected = usersID.filter((one) => one.socketId == socket.id)[0];
    usersID = usersID.filter((one) => one.socketId !== socket.id);
    if (selected) {
      io.emit("updateAdmin", selected.userId);
    }
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
