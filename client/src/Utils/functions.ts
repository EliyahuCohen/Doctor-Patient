import { ITimeSpan, Register, User } from "../types/type";
import { newMessage } from "../features/messagesSlice";
import { Socket } from "socket.io-client";
import messageSent from "../assets/messageSent.mp3";
import {
  removeLiveUser,
  updateLiveUsers,
  updateStateLive,
} from "../features/adminSlice";
import { logout, updateRole } from "../features/userSlice";

export function shuffleArray(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}

export function moveFoword(
  index: number,
  props: Register,
  setCurrentStep: any
) {
  if (index == 2) {
    if (props.fName.length > 0 && props.lName.length > 0) {
      setCurrentStep(index);
    }
  } else if (index == 3) {
    if (props.email.length > 0 && props.password.length > 0) {
      setCurrentStep(index);
    }
  } else if (index == 4) {
    if (props.role != -1 && props.location.length > 0) {
      setCurrentStep(index);
    }
  } else {
    setCurrentStep(1);
  }
}
export function check(number: number): boolean {
  document.querySelectorAll(".errorMessage").forEach((one) => {
    one.remove();
  });
  let inputs: HTMLInputElement[] = Array.from(
    document.querySelectorAll(`.input${number}`)
  );
  let ok = true;
  inputs.forEach((one: HTMLInputElement, index) => {
    const span = one.nextSibling;
    if (!one.checkValidity()) {
      one.classList.add("errorField");
      ok = false;
      if (!span || span.nodeName !== "SPAN") {
        const div = document.createElement("div");
        div.classList.add("errorMessage");
        div.style.textAlign = "left";
        div.innerHTML = `invalid ${one.name}`;
        one?.parentNode?.insertBefore(div, one.nextSibling);
      }
    } else {
      one.classList.remove("errorField");
      if (span && span.nodeName === "SPAN") {
        span.remove();
      }
    }
  });
  return ok;
}
export function SortArray(arr: User[], number: number) {
  if (number == 0) return arr;
  return arr.filter((user) => user.role == number);
}
export function sendMessageTime(dispatch: any) {
  const date = new Date();
  dispatch(
    newMessage({
      id: crypto.randomUUID(),
      message:
        date.getHours() < 12
          ? "Good Morning"
          : date.getHours() >= 12 && date.getHours() <= 17
          ? "Good Afternoon"
          : "Good Evening",
      senderId: crypto.randomUUID(),
      senderName: "System",
      time: 7000,
      type:
        date.getHours() < 12
          ? "MESSAGE"
          : date.getHours() >= 12 && date.getHours() <= 17
          ? "AFTERNOON"
          : "DARK",
    })
  );
}
export function handleSocket(
  socket: Socket,
  dispatch: any,
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setModalText: React.Dispatch<React.SetStateAction<string>>,
  setDoctorId: React.Dispatch<React.SetStateAction<string>>
) {
  socket.on("updateAdmin", (res) => {
    dispatch(removeLiveUser(res));
  });
  socket.on(
    "isApprove",
    (sock: {
      approve: boolean;
      message: { message: string; type: 1 | 2 | 3 };
    }) => {
      const { type } = sock.message;
      dispatch(updateRole(sock.approve));
      dispatch(
        newMessage({
          id: crypto.randomUUID(),
          message: sock.message.message,
          senderName: "Admin",
          type: type == 1 ? "MESSAGE" : "DELETE",
          time: 2000,
          senderId: crypto.randomUUID(),
        })
      );
      new Audio(messageSent).play();
    }
  );
  socket.on("messageSent", (sock: any) => {
    if (!window.location.pathname.includes("communication")) {
      dispatch(
        newMessage({
          id: sock.createdAt,
          message: sock.message,
          senderId: sock.senderId,
          senderName: sock.senderName,
          time: sock.time,
          type: sock.type,
        })
      );
      new Audio(messageSent).play();
    }
  });
  socket.on("newPrescription", (sock) => {
    dispatch(
      newMessage({
        id: crypto.randomUUID(),
        message: `New Prescription By ${sock.doctorName} `,
        senderId: crypto.randomUUID(),
        senderName: "System",
        time: 4000,
        type: "MESSAGE",
      })
    );
    new Audio(messageSent).play();
  });
  socket.on("post-rating", (sock) => {
    setModalOpen(true);
    setModalText(sock.message);
    setDoctorId(sock.doctorId);
  });
}
export function updateStatus(socket: Socket, dispatch: any, user: User | null) {
  socket.on("userLoggedIn", (sock: User) => {
    dispatch(updateStateLive(sock));
  });
  if (user?.role == 0) {
    dispatch(updateLiveUsers());
  }
}
export const getMinutesBetweenTimes = (
  startTime: number,
  endTime: number
): number => {
  const startHour = Math.floor(startTime);
  const startMinute = Math.round((startTime - startHour) * 100);
  const endHour = Math.floor(endTime);
  const endMinute = Math.round((endTime - endHour) * 100);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  return endTotalMinutes - startTotalMinutes;
};
export const formatTime = (timeObj: ITimeSpan): string => {
  const startTimeHour = Math.floor(timeObj.startTime);
  const startTimeMinute = Math.round((timeObj.startTime - startTimeHour) * 100);
  const endTimeHour = Math.floor(timeObj.endTime);
  const endTimeMinute = Math.round((timeObj.endTime - endTimeHour) * 100);

  const startTimeFormatted = `${startTimeHour
    .toString()
    .padStart(2, "0")}:${startTimeMinute.toString().padStart(2, "0")}`;
  const endTimeFormatted = `${endTimeHour
    .toString()
    .padStart(2, "0")}:${endTimeMinute.toString().padStart(2, "0")}`;

  return `${startTimeFormatted} - ${endTimeFormatted}`;
};
