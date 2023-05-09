import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { User } from "../../types/type";

const MostMeeting = ({ users }: { users: User[] }) => {
  return (
    <div>
      <h2>Most Meetings</h2>
      <LineChart
        width={400}
        height={400}
        data={users
          .filter((one) => one.role === 1)
          .map((one) => {
            return {
              doctorName: `${one.fName} ${one.lName}`,
              amount: one.meetingAmount,
            };
          })}
      >
        <XAxis dataKey="doctorName" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        <Line
          accentHeight={"title"}
          type="monotone"
          dataKey="amount"
          stroke="#8884d8"
        />
      </LineChart>
    </div>
  );
};

export default MostMeeting;
