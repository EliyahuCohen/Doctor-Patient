import { useSelector } from "react-redux";
import { messagesType } from "../../features/messagesSlice";
import { IMessage } from "../../types/type";
import Message from "../Message/Message";

const Messages = () => {
  const { messages } = useSelector(
    (state: { messagesSlice: messagesType }) => state.messagesSlice
  );
  return (
    <div>
      <div className="messagesWrapper">
        <div className="abs">
          {messages.map((message: IMessage) => {
            return <Message key={message.id} {...message} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Messages;
