import { IMessage } from "../../types/type";
import { useEffect } from "react";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import LightModeIcon from "@mui/icons-material/LightMode";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import "./app.scss";
import { useDispatch } from "react-redux";
import { deleteMessage } from "../../features/messagesSlice";
const Message = ({ message, senderName, type, time, id }: IMessage) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      dispatch(deleteMessage(id));
    }, time);
  }, [message]);
  return (
    <div className="messageWrraper">
      <div className="message">
        {type == "MESSAGE" ? (
          <EmailOutlinedIcon fontSize="large" className="success" />
        ) : type == "DELETE" ? (
          <DeleteOutlineOutlinedIcon fontSize="large" className="delete" />
        ) : type == "SYSTEM" ? (
          <PriorityHighOutlinedIcon fontSize="large" className="system" />
        ) : type == "AFTERNOON" ? (
          <LightModeIcon fontSize="large" className="system" />
        ) : (
          <BedtimeIcon fontSize="large" className="dark" />
        )}
        <div>
          <strong>{senderName}</strong>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
