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

const TimeSelect = () => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number>(0);
  const [daysList, setDaysList] = useState<ScheduleDay[]>([
    { day: "Sunday", schedule: { day: 1, times: [] } },
    { day: "Monday", schedule: { day: 2, times: [] } },
    { day: "Tuesday", schedule: { day: 3, times: [] } },
    { day: "Wednesday", schedule: { day: 4, times: [] } },
    { day: "Thursday", schedule: { day: 5, times: [] } },
    { day: "Friday", schedule: { day: 6, times: [] } },
  ]);
  const { getSchedual } = useSchedual();
  useEffect(() => {
    getSchedual(setDaysList, daysList);
  }, []);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:10");

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  const handleSave = useCallback(
    (event: any) => {
      event.preventDefault();
      const startTimeFirstNumber = Number(startTime.split(":")[0]);
      const startTimeRemaining = Number(startTime.split(":")[1]);
      const endTimeFirstNumber = Number(endTime.split(":")[0]);
      const endTimeRemaining = Number(endTime.split(":")[1]);
      const finalNumber1 = startTimeFirstNumber + startTimeRemaining / 100;
      const finalNumber2 = endTimeFirstNumber + endTimeRemaining / 100;
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
      const newSchedule = {
        ...selectedDay.schedule,
        times: [...selectedDay.schedule.times, newTimeSpan],
      };
      setDaysList([
        ...daysList.slice(0, selected),
        { ...selectedDay, schedule: newSchedule },
        ...daysList.slice(selected + 1),
      ]);
      // reset form inputs
      setStartTime("09:00");
      setEndTime("09:10");
    },
    [daysList, selected, startTime, endTime]
  );
  function removeHour(index: number) {
    const week = [...daysList];
    week[selected].schedule.times.splice(index, 1);
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
          <BsPlus
            fontSize="medium"
            title="add doctor"
            className="i"
            onClick={handleSave}
          />
        </div>
      </div>
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
            onChange={handleStartTimeChange}
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
            onChange={handleEndTimeChange}
          />
        </div>
      </form>
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
