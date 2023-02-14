import { format } from "date-fns"
import { User } from "../../types/type"

const AdminUserLine = ({user}:{user:User}) => {
    return (
        <div key={user._id} className="user-info">
            <p className="mainLine">
              <span
                title="is user online"
                className={`${user.live ? "live" : ""}`}
              ></span>
              {user.email}
            </p>

            <p>{user.role == 1 ? "Doctors" : "Patient"}</p>
            <p className={`status ${user.approved ? "approved" : "pending"}`}>
              {user.approved ? "Approved" : "Pending"}
            </p>
            <p className="delete-small">
              {format(new Date(user.createdAt), "dd/MM/yyyy")}
            </p>
            <p title="more details" className="arrow delete-small">
              🧐
            </p>
          </div>
    )
}

export default AdminUserLine
