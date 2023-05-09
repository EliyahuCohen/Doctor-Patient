import { PieChart, Pie, Legend, Cell } from "recharts";
const PieCharts = ({
  data,
  COLORS,
}: {
  COLORS: string[];
  data: { name: string; value: number }[];
}) => {
  return (
    <div>
      <h2>Doctors vs Patients</h2>
      <PieChart width={400} height={400}>
        <Pie
          className="pieChart"
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell
              className="oneCell"
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieCharts;
