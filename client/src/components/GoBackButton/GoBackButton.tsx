import "./app.scss"
import { Link } from "react-router-dom";

export interface IButtonProps{
    whereTo:string;
}

const GoBackButton = ({whereTo}:IButtonProps) => {
  return (
    <div>GoBackButton</div>
  )
}

export default GoBackButton