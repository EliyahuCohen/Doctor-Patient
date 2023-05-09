import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { User } from "../../types/type";
export interface dataType {
  name: string;
  rating: number;
}
const TopDoctors = ({ d }: { d: User[] }) => {
  const data: dataType[] = d
    .filter((one) => one.role == 1 && one.approved)
    .map((one) => {
      return {
        name: one.fName + " " + one.lName,
        rating: one.userRating.sum,
      };
    });
  return (
    <div className="bar">
      <h2>Top Rated</h2>
      <BarChart
        width={550}
        height={550}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="rating" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default TopDoctors;
