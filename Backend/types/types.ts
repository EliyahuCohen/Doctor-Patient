export class SendMessage {
  message: string;
  createdAt: Date;
  senderName: string;
  type: "MESSAGE" | "SYSTEM" | "DELETE ";
  time: 2000 | 3000 | 4000 | 5000;
  constructor(
    message: string,
    createdAt: Date,
    senderName: string,
    type: "MESSAGE" | "SYSTEM" | "DELETE ",
    time: 2000 | 3000 | 4000 | 5000
  ) {
    this.message = message;
    this.createdAt = createdAt;
    this.senderName = senderName;
    this.type = type;
    this.time = time;
  }
}