import { useState } from "react";
import { GrStatusGood, GrStatusWarning } from "react-icons/gr";
import { BiErrorAlt } from "react-icons/bi";
import { motion } from "framer-motion";
import "./app.scss";
import { IAlert } from "../../types/type";
import { useGetSystemMessages } from "../../hooks/useGetSystemMessages";
const SystemMessagesPage = () => {
  const [choice, setChoice] = useState<0 | 1 | 2 | 3>(0);
  const [messages, setMessages] = useState<IAlert[]>([]);
  const a = useGetSystemMessages(setMessages);
  return (
    <div className="systemWrapper">
      <select
        onChange={(e) => setChoice(parseInt(e.target.value) as 0 | 1 | 2 | 3)}
      >
        <option value="0">ALL</option>
        <option value="1">SUCCESS</option>
        <option value="2">WARNING</option>
        <option value="3">DANGER</option>
      </select>
      <div>
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
                  <motion.div
                    layout
                    className={`systemAlert ${
                      message.type == 1
                        ? "good"
                        : message.type == 3
                        ? "bad"
                        : ""
                    }`}
                  >
                    {message.type == 2 ? (
                      <GrStatusWarning fontSize="large" />
                    ) : message.type == 1 ? (
                      <GrStatusGood />
                    ) : (
                      <BiErrorAlt />
                    )}
                    <strong>{message.message}</strong>
                  </motion.div>
                </motion.div>
              );
            }
          })}
      </div>
    </div>
  );
};

export default SystemMessagesPage;
