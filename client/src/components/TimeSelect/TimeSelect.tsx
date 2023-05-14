import "./ts.scss";
import React, { useState, useEffect, useCallback } from "react";
import { useSchedual } from "../../hooks/useSchedual";
import { ITimeSpan, ScheduleDay } from "../../types/type";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { BsPlus } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { newMessage } from "../../features/messagesSlice";
import { formatTime } from "../../Utils/functions";
import { AiOutlineDelete } from "react-icons/ai";

export type ITime = 0.3 | 0.1 | 0.2 | 0.6;
const TimeSelect = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [skipIn, setskipIn] = useState<ITime>(0.1);
  const [selected, setSelected] = useState<number>(0);
  const [daysList, setDaysList] = useState<ScheduleDay[]>([
    { day: "Sunday", schedule: { day: 1, times: [] } },
    { day: "Monday", schedule: { day: 2, times: [] } },
    { day: "Tuesday", schedule: { day: 3, times: [] } },
    { day: "Wednesday", schedule: { day: 4, times: [] } },
    { day: "Thursday", schedule: { day: 5, times: [] } },
    { day: "Friday", schedule: { day: 6, times: [] } },
  ]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const { getSchedual } = useSchedual();
  useEffect(() => {
    getSchedual(setDaysList, daysList);
  }, []);

  function createMeetings(start: number, end: number) {
    const arr = [];
    while (start < end && end - start >= skipIn) {
      const startTemp = start;
      start = roundUpAtSix(start, Number(skipIn.toFixed(1)));
      const newTimeSpan: ITimeSpan = {
        startTime: startTemp,
        endTime: start,
      };
      arr.push(newTimeSpan);
    }
    return arr;
  }
  const handleSave = useCallback(
    (event: any) => {
      event.preventDefault();
      const startTimeFirstNumber = Number(startTime.split(":")[0]);
      const startTimeRemaining = Number(startTime.split(":")[1]);
      const endTimeFirstNumber = Number(endTime.split(":")[0]);
      const endTimeRemaining = Number(endTime.split(":")[1]);
      const finalNumber1 = startTimeFirstNumber + startTimeRemaining / 100;
      const finalNumber2 = endTimeFirstNumber + endTimeRemaining / 100;

      if (!(finalNumber1 >= 9 && finalNumber2 <= 19)) {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Working hours are between 9:00AM - 19:00PM ",
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 3000,
            type: "DELETE",
          })
        );
      }
      // check if start time is smaller than end time
      if (finalNumber1 >= finalNumber2) {
        dispatch(
          newMessage({
            id: crypto.randomUUID(),
            message: "Start time must be smaller than end time",
            senderId: crypto.randomUUID(),
            senderName: "System",
            time: 3000,
            type: "DELETE",
          })
        );
        return;
      }
      // check for overlapping times
      const selectedDay = daysList[selected];
      for (let i = 0; i < selectedDay.schedule.times.length; i++) {
        const timeSpan = selectedDay.schedule.times[i];
        const startTimeSpan = timeSpan.startTime;
        const endTimeSpan = timeSpan.endTime;
        if (
          (finalNumber1 >= startTimeSpan && finalNumber1 <= endTimeSpan) ||
          (finalNumber2 >= startTimeSpan && finalNumber2 <= endTimeSpan)
        ) {
          dispatch(
            newMessage({
              id: crypto.randomUUID(),
              message: "Overlapping times are not allowed",
              senderId: crypto.randomUUID(),
              senderName: "System",
              time: 3000,
              type: "DELETE",
            })
          );
          return;
        }
      }
      // add new time span to selected day's schedule
      const newTimeSpan: ITimeSpan = {
        startTime: finalNumber1,
        endTime: finalNumber2,
      };
      const newMeetings = createMeetings(finalNumber1, finalNumber2);
      const updatedSchedule = {
        ...selectedDay.schedule,
        times: selectedDay.schedule.times.concat(newMeetings),
      };
      const updatedDay = { ...selectedDay, schedule: updatedSchedule };
      const updatedDaysList = [
        ...daysList.slice(0, selected),
        updatedDay,
        ...daysList.slice(selected + 1),
      ];
      setDaysList(updatedDaysList);
      // reset form inputs
      setStartTime(endTime)
      const numberHours = Number(endTime.split(":")[0])+1
      const numberMinutes = endTime.split(":")[1]
      
      console.log(numberHours)
      
      
      setStartTime(endTime)
      setEndTime(`${numberHours}:${numberMinutes}`)
    },
    [daysList, selected, startTime, endTime]
  );

  function removeHour(index: number) {
    const week = [...daysList];
    week[selected].schedule.times.splice(index, 1);
    setDaysList(week);
  }
  function roundUpAtSix(num: number, increment: number): number {
    while (increment > 0) {
      increment = Number((increment - 0.1).toFixed(1));
      if (Number(Number(num % 1).toFixed(1)) < 0.5) {
        num = Number((num + 0.1).toFixed(1));
      } else {
        num++;
        num -= num % 1;
      }
    }
    return num;
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
      <h2
        style={{
          color: "#229f97",
          textAlign: "center",
          fontSize: "1.02em",
          marginBottom: "1rem",
        }}
      >
        Enter your shift
      </h2>
      <form className="timeForm">
        <div>
          <input
            type="time"
            id="start-time"
            name="start-time"
            min="09:00"
            max="17:00"
            step="600"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <input
            type="time"
            id="end-time"
            name="end-time"
            min="09:00"
            max="19:00"
            step="600"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <select onChange={(e) => {
          console.log(e.target.value)
          setskipIn(Number(e.target.value) as ITime)
        }}>
          <option value="0.1">
            10 Minutes
          </option>
          <option value="0.2" >
            20 Minutes
          </option>
          <option value="0.3" >
            30 Minutes
          </option>
          <option value="0.6" >
            1 hour
          </option>
        </select>
      </form>
      <div className="times">
        <div className="icon">
          <BsPlus
            fontSize="medium"
            title="add doctor"
            className="i"
            onClick={handleSave}
          />
        </div>
      </div>
      {daysList[selected].schedule.times.map((time, index) => {
        return (
          <div className="timeLine" key={time.endTime + time.startTime + index}>
            <div>{formatTime(time)}</div>
            <div>
              <AiOutlineDelete
                onClick={() => removeHour(index)}
                color="red"
                cursor={"pointer"}
                fontSize={"1.2em"}
              />
            </div>
          </div>
        );
      })}
      {daysList.filter((one) => one.schedule.times.length == 0).length != 6 ? (
        <div className="savebtn">
          <button onClick={() => setModalOpen(true)}>Save Schedual</button>
        </div>
      ) : null}
      {modalOpen ? (
        <ConfirmModal daysList={daysList} setModalOpen={setModalOpen} />
      ) : null}
    </div>
  );
};

export default React.memo(TimeSelect);
