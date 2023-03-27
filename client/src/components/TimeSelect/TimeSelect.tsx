import "./app.scss";
import { useState } from "react";
import { ScheduleDay } from "../../types/type";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { useSchedual } from "../../hooks/useSchedual";

const TimeSelect = () => {
  const [selected, setSelected] = useState<number>(0);
  const [daysList, setDaysList] = useState<ScheduleDay[]>([
    { day: "Sunday", schedule: { day: 1, times: [] } },
    { day: "Monday", schedule: { day: 2, times: [] } },
    { day: "Tuesday", schedule: { day: 3, times: [] } },
    { day: "Wednesday", schedule: { day: 4, times: [] } },
    { day: "Thursday", schedule: { day: 5, times: [] } },
    { day: "Friday", schedule: { day: 6, times: [] } },
  ]);
  const { postSchedual } = useSchedual(setDaysList, daysList);
  function removeHour(index: number) {
    const week = [...daysList];
    week[selected].schedule.times.splice(index, 1);
    setDaysList(week);
  }
  function addHours() {
    const week = [...daysList];
    if (week[selected].schedule.times.length > 0) {
      week[selected].schedule.times = [
        ...week[selected].schedule.times,
        {
          startTime:
            week[selected].schedule.times[
              week[selected].schedule.times.length - 1
            ].endTime,
          endTime: (week[selected].schedule.times[
            week[selected].schedule.times.length - 1
          ].endTime + 1) as any,
        },
      ];
    } else {
      week[selected].schedule.times = [
        ...week[selected].schedule.times,
        { startTime: 9, endTime: 10 },
      ];
    }
    setDaysList(week);
  }
  function setHour1(index: number, start: number) {
    const week = [...daysList];
    week[selected].schedule.times[index].startTime = start as any;
    setDaysList(week);
  }
  function setHour2(index: number, end: number) {
    const week = [...daysList];
    week[selected].schedule.times[index].endTime = end as any;
    setDaysList(week);
  }

  return (
    <div className="workTime">
      <h1>Manage your shifts</h1>
      <div className="daysList">
        {daysList.map((day, index) => {
          return (
            <div
              className={
                selected === index ? `singleDay selected1` : `singleDay`
              }
              key={`${day.day}${index}${day.schedule.times.entries}`}
              onClick={() => setSelected(index)}
            >
              {day.day}
            </div>
          );
        })}
      </div>
      <div className="times">
        <div className="icon">
          <AddIcon fontSize="medium" className="i" onClick={addHours} />
        </div>
      </div>
      {daysList[selected].schedule.times.length == 0 ? (
        <h3 className="noS">No Schedual</h3>
      ) : null}
      <div className="hours">
        {daysList[selected].schedule.times.map((sch, index) => {
          return (
            <div className="line" key={crypto.randomUUID()}>
              <div>
                <p>Start</p>
                <select
                  defaultValue={sch.startTime}
                  onChange={(e) => setHour1(index, parseInt(e.target.value))}
                >
                  {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(
                    (number, index) => {
                      return (
                        <option value={number} key={number + index}>
                          {number}:00
                        </option>
                      );
                    }
                  )}
                </select>
              </div>
              <div>
                <p>End</p>
                <select
                  onChange={(e) => setHour2(index, parseInt(e.target.value))}
                  defaultValue={sch.endTime}
                >
                  {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(
                    (number, tindex) => {
                      return (
                        <option value={number} key={number + tindex}>
                          {number}:00
                        </option>
                      );
                    }
                  )}
                </select>
              </div>
              <DeleteOutlineOutlined
                onClick={() => {
                  removeHour(index);
                }}
                titleAccess="delete meeting time"
                fontSize="medium"
                className="trash"
              />
            </div>
          );
        })}
      </div>
      <div className="savebtn">
        <button onClick={() => postSchedual(daysList)}>Save Schedual</button>
      </div>
    </div>
  );
};

export default TimeSelect;
