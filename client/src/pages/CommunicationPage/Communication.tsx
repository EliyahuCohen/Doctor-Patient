import { useEffect, useLayoutEffect, useRef, useState } from "react";
import formatDistance from "date-fns/esm/formatDistance";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useParams } from "react-router-dom";
import { useMessages } from "../../hooks/useMessages";
import "./app.scss";
import { socket } from "../../App";

export interface IMessage {
  message: string;
  sender: string;
  createdAt: Date;
}

const Communication = () => {
  const { userid } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { getConversation, sendNewMessage } = useMessages(setMessages);

  useLayoutEffect(() => {
    divRef.current?.scrollTo(
      divRef.current?.scrollHeight,
      divRef.current?.scrollHeight
    );
    inputRef.current?.focus();
  }, [messages]);
  useEffect(() => {
    if (userid) {
      getConversation(userid);
    }
  }, []);
  useEffect(() => {
    socket.on("messageSent", (sock: any) => {
      setMessages((prev) => [
        ...prev,
        {
          createdAt: sock.createdAt,
          message: sock.message,
          sender: sock.senderId,
        },
      ]);
    });
  }, [socket]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    if (inputRef.current?.value.length! >= 1) {
      sendNewMessage(inputRef.current!.value, userid!);
      inputRef.current!.value = "";
    } else {
    }
  }
  return (
    <div className="communication">
      <h1>Get In Touch 💬</h1>
      <div className="messageList" ref={divRef}>
        <div>
          {messages.map((message: IMessage, index) => {
            return (
              <div key={message.sender + message.message + index}>
                <p className={message.sender == userid! ? "right" : "left"}>
                  {message.message}
                  <span>
                    {formatDistance(new Date(message.createdAt), new Date())}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <form className="sendingMessage" action="">
        <input ref={inputRef} type="text" placeholder={`Write a message...`} />
        <button onClick={(e) => handleClick(e)}>
          <EmailOutlinedIcon fontSize="large" style={{ color: "#333" }} />
        </button>
      </form>
    </div>
  );
};

export default Communication;
