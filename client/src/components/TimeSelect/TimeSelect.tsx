import "./app.scss";
import { Schedule, ITimeSpan } from "../../types/type";

export interface ScheduleDays {
  schedual: Schedule;
  day: string;
}

const TimeSelect = () => {
  const daysList: ScheduleDays[] = [
    { day: "Sunday", schedual: { day: 1, times: [] } },
    { day: "Monday", schedual: { day: 2, times: [] } },
    { day: "Tuesday", schedual: { day: 3, times: [] } },
    { day: "Wednesday", schedual: { day: 4, times: [] } },
    { day: "Thursday", schedual: { day: 5, times: [] } },
    { day: "Friday", schedual: { day: 6, times: [] } },
  ];
  return (
    <div className="workTime">
      <h1>List of Work Days</h1>
      <div className="daysList"></div>
    </div>
  );
};

export default TimeSelect;
