import { IMessage } from "../../types/type";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PriorityHighOutlinedIcon from "@mui/icons-material/PriorityHighOutlined";
import "./app.scss";
const Message = ({ message, sender, type }: IMessage) => {
  return (
    <div className="messageWrraper">
      <div className="message">
        {type == "MESSAGE" ? (
          <EmailOutlinedIcon fontSize="large" className="success" />
        ) : type == "DELETE" ? (
          <DeleteOutlineOutlinedIcon fontSize="large" className="delete" />
        ) : (
          <PriorityHighOutlinedIcon fontSize="large" className="system" />
        )}
        <div>
          <strong>{sender}</strong>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Message;
