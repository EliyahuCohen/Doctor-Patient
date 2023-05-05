import { useSelector } from "react-redux";
import { messagesType } from "../../features/messagesSlice";
import { IMessage } from "../../types/type";
import { lazy } from "react";

import "./messages.scss";
import React from "react";

const Message = lazy(() => import("../Message/Message"));

const Messages = () => {
  const { messages } = useSelector(
    (state: { messagesSlice: messagesType }) => state.messagesSlice
  );
  return (
    <div className="messagesWrapper">
      <div className="abs">
        {messages.map((message: IMessage) => {
          return <Message key={message.id} {...message} />;
        })}
      </div>
    </div>
  );
};

export default React.memo(Messages);
