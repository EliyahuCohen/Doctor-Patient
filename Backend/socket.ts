import { Server } from "socket.io";
import { user } from "./server";

export let admin: user | null = null;
export let usersID: user[] = [];
export function socketHandler(io: Server) {
  io.on("connection", (socket) => {
    socket.on("userConnected", (data: any) => {
      if (data && data._id && socket) {
        if (data.role !== 0) {
          usersID.push({ userId: data._id, socketId: socket.id });
        } else {
          admin = {
            userId: data._id,
            socketId: socket.id,
          };
        }
        //update admin of each new login
        if (admin) {
          io.to(admin.socketId).emit("userLoggedIn", data);
        }
        //update everyone that this user is now online - to show by the chat
        io.emit("user-in", data._id);
      }
    });
    //unintentinal sudden disconnection
    socket.on("disconnect", () => {
      let selected = usersID.filter((one) => one.socketId == socket.id)[0];
      if (selected) {
        usersID.splice(
          usersID.findIndex((user) => user.socketId == selected.socketId),
          1
        );
      }
      //update admin that this user is now logged out
      if (selected && admin) {
        io.to(admin.socketId).emit("updateAdmin", selected?.userId);
      }
      //update everyone that this user is no longer online (for chat)
      io.emit("user-out", selected?.userId);
    });
    socket.on("userLoggedOut", () => {
      let selected = usersID.filter((one) => one?.socketId == socket?.id)[0];
      if (selected) {
        usersID.splice(
          usersID.findIndex((user) => user?.socketId == selected?.socketId),
          1
        );
      }
      if (selected && admin) {
        io.to(admin.socketId).emit("updateAdmin", selected.userId);
      }
      io.emit("user-out", selected?.userId);
    });
    //events for handling video calls
    socket.on("is-user-live", (sock) => {
      const { userid, askingId } = sock;
      const findUser = usersID.filter((one) => one?.userId == userid)[0];
      io.to(usersID.filter((one) => one?.userId == askingId)[0]?.socketId).emit(
        "user-status",
        findUser ? true : false
      );
    });
    socket.on("join room", (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit("user connected");
    });

    socket.on("offer", (offer, roomId) => {
      socket.to(roomId).emit("offer", offer, socket.id);
    });

    socket.on("answer", (answer, roomId) => {
      socket.to(roomId).emit("answer", answer, socket.id);
    });

    socket.on("ice candidate", (candidate, roomId) => {
      socket.to(roomId).emit("ice candidate", candidate, socket.id);
    });
    socket.on("leave-call", (roomNum: string,doctorId:string,meetingId:string) => {
      io.to(roomNum).emit("user-left",doctorId,meetingId);
    });
  });
}
