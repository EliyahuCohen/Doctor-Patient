import React, { useEffect, useState } from "react";
import "./charts.scss";
import { User } from "../../types/type";
import { useGetAllUsers } from "../../hooks/useGetAllUsers";
import PieCharts from "./PieChart";
import TopDoctors from "./TopDoctors";
import BlockedDoctors from "./BlockedDoctors";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Charts = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { getUsers } = useGetAllUsers();
  const [data, setData] = useState<{ name: string; value: number }[]>([
    { name: "Doctor", value: 0 },
    { name: "Patient", value: 0 },
  ]);
  useEffect(() => {
    getUsers(setUsers);
  }, []);
  useEffect(() => {
    setData(() => [
      {
        name: "Doctors",
        value: users.filter((user) => user.role === 1).length,
      },
      {
        name: "Patients",
        value: users.filter((user) => user.role === 2).length,
      },
    ]);
  }, [users]);
  return (
    <div className="chartsWrapper">
      <h1 style={{ textAlign: "center" }}>Charts and Statistics</h1>
      <div className="chartsList">
        <PieCharts data={data} COLORS={COLORS} />
        <TopDoctors d={users} />
      </div>
      <div className="secondPart">
        <h2>List of Blocked Doctors</h2>
        <BlockedDoctors users={users} />
      </div>
    </div>
  );
};

export default React.memo(Charts);
