import { useEffect, useLayoutEffect, useRef, useState } from "react";
import formatDistance from "date-fns/esm/formatDistance";
import { useParams } from "react-router-dom";
import { useMessages } from "../../hooks/useMessages";
import { RiSendPlaneLine } from "react-icons/ri";
import "./communication.scss";
import { socket } from "../../App";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { useDispatch, useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { FiCopy } from "react-icons/fi";
import { newMessage } from "../../features/messagesSlice";

export interface IMessage {
  message: string;
  sender: string;
  read: boolean;
  createdAt: Date;
}

const Communication = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const dispatch=useDispatch()
  const { userid } = useParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [live, setLive] = useState<boolean>(false);
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
      socket.emit("is-user-live", { userid, askingId: user?._id });
    }
  }, []);
  useEffect(() => {
    socket.on("messageSent", (sock: any) => {
      if (window.location.pathname.includes(`communication/${sock.senderId}`)) {
        setMessages((prev) => [
          ...prev,
          {
            createdAt: sock.createdAt,
            message: sock.message,
            sender: sock.senderId,
            read: false,
          },
        ]);
      }
    });
    socket.on("user-status", (sock) => setLive(sock));
    socket.on("user-in", (sock) => {
      if (sock == userid) {
        setLive(true);
      }
    });
    socket.on("user-out", (sock) => {
      if (sock == userid) {
        setLive(false);
      }
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
      <GoBackButton backgroundColor="#D3D3D3" whereTo="dashboard/2" />
      <h1>
        Get In Touch 💬{" "}
        {live ? (
          <span className="online"></span>
        ) : (
          <span className="offline"></span>
        )}
      </h1>
      <div className="messageList" ref={divRef}>
        <div>
          {messages.map((message: IMessage, index) => {
            return (
              <div key={message.sender + message.message + index}>
                <p className={message.sender == userid! ? "right" : "left"}>
                <FiCopy className="copyIcon" onClick={()=>{
                   navigator.clipboard.writeText(message.message)
                   dispatch(newMessage({
                    id:message.createdAt.toString(),
                    message:"Copied successfully!",
                    senderId:crypto.randomUUID(),
                    senderName:"System",
                    time:3000,
                    type:"MESSAGE"
                   }))
                }}/>
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
      <form className="sendingMessage">
        <input ref={inputRef} type="text" placeholder={`Write a message...`} />
        <button className="sendBtn" onClick={(e) => handleClick(e)}>
          <RiSendPlaneLine
            fontSize="large"
            style={{
              border: 0,
              color: "#9aa2f3",
              rotate: "-45deg",
              background: "transparent",
            }}
          />
        </button>
      </form>
    </div>
  );
};

export default Communication;
