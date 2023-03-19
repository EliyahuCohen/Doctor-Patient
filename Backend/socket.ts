import { Server } from "socket.io";
import { user } from "./server";

export let admin: user | null = null;
export let usersID: user[] = [];
export function socket(io: Server) {
  io.on("connection", (socket) => {
    socket.on("userConnected", (data: any) => {
      if (data._id && socket) {
        if (data.role !== 0) {
          usersID.push({ userId: data._id, socketId: socket.id });
        } else {
          admin = {
            userId: data._id,
            socketId: socket.id,
          };
        }
        if (admin) {
          io.to(admin.socketId).emit("userLoggedIn", data);
        }
      }
    });
    socket.on("newUser", (id) => {
      usersID.push({ userId: id, socketId: socket.id });
    });
    socket.on("disconnect", () => {
      let selected = usersID.filter((one) => one.socketId == socket.id)[0];
      usersID = usersID.filter((one) => one.socketId !== socket.id);
      if (selected && admin) {
        io.to(admin.socketId).emit("updateAdmin", selected.userId);
      }
    });
    socket.on("userLoggedOut", () => {
      let selected = usersID.filter((one) => one.socketId == socket.id)[0];
      usersID = usersID.filter((one) => one.socketId !== socket.id);
      if (selected && admin) {
        io.to(admin.socketId).emit("updateAdmin", selected.userId);
      }
    });
  });
}
