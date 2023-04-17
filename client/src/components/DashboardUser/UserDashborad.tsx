import { Link } from "react-router-dom";
import { User } from "../../types/type";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
const UserDashborad = ({ user }: { user: User }) => {
  const { user: TheUser } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  return (
    <div className="userLine" key={user._id}>
      <div>
        {TheUser?.role == 1 ? (
          <strong>{user.fName + " " + user.lName}</strong>
        ) : (
          <strong>{user.fName + " " + user.lName}</strong>
        )}
        <div className="userInfo">
          <p className="email">{user.email}</p>
        </div>
      </div>
      <div className={`${user.isMale ? "male" : "female"}`}>
        {user.isMale ? "Male" : "Female"}
      </div>
      <div className="icons">
        {user.role == 1 ? (
          <Link to={`/booking/${user._id}`}>
            <LibraryBooksIcon className="lib" />
          </Link>
        ) : null}
        <Link to={`/communication/${user._id}`}>
          <WhatsAppIcon className="what" />
        </Link>
      </div>
    </div>
  );
};

export default UserDashborad;
