import { IMessage } from "../../types/type";
import React, { useEffect } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import { FiSun } from "react-icons/fi";
import { MdOutlineWarningAmber } from "react-icons/md";
import { MdOutlineNightsStay } from "react-icons/md";
import { MdOutlineReportGmailerrorred } from "react-icons/md";
import "./app.scss";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { deleteMessage } from "../../features/messagesSlice";
const Message = ({ message, senderName, type, time, id }: IMessage) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(deleteMessage(id));
    }, time);
  }, [message]);
  return (
    <motion.div
      initial={{ x: -50 }}
      whileInView={{ x: 0 }}
      className="messageWrraper"
    >
      <div className="message">
        {type == "MESSAGE" ? (
          <AiOutlineMail fontSize="1.5rem" className="success" />
        ) : type == "DELETE" ? (
          <MdOutlineDelete fontSize="1.5rem" className="delete" />
        ) : type == "SYSTEM" ? (
          <MdOutlineWarningAmber fontSize="1.5rem" className="system" />
        ) : type == "AFTERNOON" ? (
          <FiSun fontSize="1.5rem" className="system" />
        ) : type == "DARK" ? (
          <MdOutlineNightsStay fontSize="1.5rem" className="dark" />
        ) : (
          <MdOutlineReportGmailerrorred fontSize="1.5rem" className="delete" />
        )}
        <div>
          <strong>{senderName}</strong>
          <p>{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(Message);
