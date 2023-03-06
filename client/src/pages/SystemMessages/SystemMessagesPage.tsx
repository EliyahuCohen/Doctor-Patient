import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { UserType } from "../../features/userSlice";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckIcon from "@mui/icons-material/Check";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { motion } from "framer-motion";
import "./app.scss";
import { IAlert, IMessage } from "../../types/type";
import { useGetSystemMessages } from "../../hooks/useGetSystemMessages";
const SystemMessagesPage = () => {
  const [choice, setChoice] = useState<0 | 1 | 2 | 3>(0);
  const [messages, setMessages] = useState<IAlert[]>([]);
  const a = useGetSystemMessages(setMessages);
  return (
    <div className="systemWrapper">
      <h1>System Messages</h1>
      <select
        onChange={(e) => setChoice(parseInt(e.target.value) as 0 | 1 | 2 | 3)}
      >
        <option value="0">ALL</option>
        <option value="1">SUCCESS</option>
        <option value="2">WARNING</option>
        <option value="3">DANGER</option>
      </select>
      {messages &&
        messages.map((message: IAlert, index: number) => {
          if (
            choice == 0 ||
            (choice == 1 && message.type == 1) ||
            (choice == 2 && message.type == 2) ||
            (choice == 3 && message.type == 3)
          ) {
            return (
              <motion.div
                layout
                transition={{ duration: 1 }}
                key={(index + message.message + message.type).toString()}
              >
                <div
                  className={`systemAlert ${
                    message.type == 1 ? "good" : message.type == 3 ? "bad" : ""
                  }`}
                >
                  {message.type == 2 ? (
                    <PriorityHighIcon fontSize="large" />
                  ) : message.type == 1 ? (
                    <CheckIcon />
                  ) : (
                    <HighlightOffIcon />
                  )}
                  <strong>{message.message}</strong>
                </div>
              </motion.div>
            );
          }
        })}
    </div>
  );
};

export default SystemMessagesPage;
