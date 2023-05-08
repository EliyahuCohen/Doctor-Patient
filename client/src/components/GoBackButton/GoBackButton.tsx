import { FiChevronDown } from "react-icons/fi";
import "./go.scss";
import { Link } from "react-router-dom";

export interface IButtonProps {
  whereTo: string;
  backgroundColor: string;
}

const GoBackButton = ({ whereTo, backgroundColor }: IButtonProps) => {
  return (
    <Link to={`/${whereTo}`}>
      <div className="backBtnWrapper">
        <FiChevronDown
          className="backBtn"
          style={{ backgroundColor: backgroundColor, color: "#888" }}
        />
      </div>
    </Link>
  );
};

export default GoBackButton;
