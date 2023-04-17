import { useEffect } from "react";
import "./app.scss";
import { useParams } from "react-router-dom";
const UserManagment = () => {
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      console.log(id);
    }
  }, [id]);
  return <div></div>;
};

export default UserManagment;
