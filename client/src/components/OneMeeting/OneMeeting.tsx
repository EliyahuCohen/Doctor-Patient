import { useMeetings } from "../../hooks/useMeetings";
import { ITimeSpan, Schedule } from "../../types/type";
import React from "react";
import { getMinutesBetweenTimes, formatTime } from "../../Utils/functions";

interface IMeet {
  availableMeetings: Schedule | null;
  meeting: ITimeSpan | null;
  index: number;
  selectedDate: {
    month: string;
    day: number;
  } | null;
  date: Date;
  setAvailableMeetings: React.Dispatch<React.SetStateAction<Schedule | null>>;
  id: any;
}

const OneMeeting = ({
  availableMeetings,
  meeting,
  index,
  selectedDate,
  date,
  setAvailableMeetings,
  id,
}: IMeet) => {
  const { postMeeting } = useMeetings();
  const d = new Date(`${selectedDate?.month}-${selectedDate?.day}-2023`);
  const options: Intl.DateTimeFormatOptions = { weekday: "long" };
  const dayName = d.toLocaleDateString("en-US", options);
  function bookUI() {
    const tempMeetings: ITimeSpan[] = [];
    availableMeetings!.times.forEach((e) => {
      if (e.endTime != meeting!.endTime) {
        tempMeetings.push(e);
      }
    });
    setAvailableMeetings((prev: any) => {
      return { day: prev?.day!, times: tempMeetings };
    });
  }
  return (
    <div key={meeting!.startTime + index} className="meeting">
      <div className="leftSide">
        <div className="dateTime1">
          <p>{selectedDate?.day}</p>
          <p>{selectedDate?.month.substring(3, -1)}</p>
        </div>
        <div className="dateTime2">
          <p>
            {formatTime({
              endTime: meeting!.endTime,
              startTime: meeting!.startTime,
            })}
          </p>
          <p>
            {dayName} <span className="space" /> • <span className="space" />
            {meeting!.startTime} AM • <span className="space" />
            {getMinutesBetweenTimes(meeting!.startTime, meeting!.endTime)}{" "}
            minutes{" "}
          </p>
        </div>
      </div>
      <span
        onClick={(e) => {
          postMeeting(date, id, meeting!.endTime, meeting!.startTime, bookUI);
        }}
        title="Book Meeting"
        className="book"
      >
        Book
      </span>
    </div>
  );
};

export default React.memo(OneMeeting);
