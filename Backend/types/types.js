"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessage = void 0;
class SendMessage {
    constructor(message, createdAt, senderName, type, time) {
        this.message = message;
        this.createdAt = createdAt;
        this.senderName = senderName;
        this.type = type;
        this.time = time;
    }
}
exports.SendMessage = SendMessage;
