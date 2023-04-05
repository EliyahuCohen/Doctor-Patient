import { useMeetings } from "../../hooks/useMeetings";
import { ITimeSpan, Schedule } from "../../types/type";

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
  return (
    <div key={meeting!.startTime + index} className="meeting">
      <div className="leftSide">
        <div className="dateTime1">
          <p>{selectedDate?.day}</p>
          <p>{selectedDate?.month.substring(3, -1)}</p>
        </div>
        <div className="dateTime2">
          <p>
            {meeting!.startTime}:00 - {meeting!.endTime}:00
          </p>
          <p>
            {dayName} <span className="space" /> • <span className="space" />
            {meeting!.startTime} AM • <span className="space" />
            {(meeting!.endTime - meeting!.startTime) * 60} minutes{" "}
          </p>
        </div>
      </div>
      <span
        onClick={(e) => {
          postMeeting(
            new Date(
              `${selectedDate?.month}-${
                selectedDate!.day + 1
              }-${date.getFullYear()}`
            ),
            id,
            meeting!.endTime,
            meeting!.startTime
          );
          const tempMeetings: ITimeSpan[] = [];
          availableMeetings!.times.forEach((e) => {
            if (e.endTime != meeting!.endTime) {
              tempMeetings.push(e);
            }
          });
          setAvailableMeetings((prev: any) => {
            return { day: prev?.day!, times: tempMeetings };
          });
        }}
        title="Book Meeting"
        className="book"
      >
        Book
      </span>
    </div>
  );
};

export default OneMeeting;
