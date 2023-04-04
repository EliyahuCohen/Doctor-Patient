import "./app.scss";
import { useState, useEffect } from "react";
import DatePicker from "../../components/DatePicker/DatePicker";
import BlockIcon from "@mui/icons-material/Block";
import { useSchedual } from "../../hooks/useSchedual";
import { useMeetings } from "../../hooks/useMeetings";
import { useParams } from "react-router-dom";
import { ITimeSpan, Schedule } from "../../types/type";

const BookingPage = () => {
  const { id } = useParams();
  const [error, setError] = useState<boolean>(false);
  const [availableMeetings, setAvailableMeetings] = useState<Schedule | null>(
    null
  );
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<{
    month: string;
    day: number;
  } | null>(null);
  const { getMeetings } = useSchedual();
  const { postMeeting } = useMeetings();
  useEffect(() => {
    const d = new Date(`${selectedDate?.month}-${selectedDate?.day}-2023`);
    getMeetings(d, id!, d.getDay(), setAvailableMeetings, setError);
  }, [selectedDate]);
  return (
    <div className="wrapperDate">
      <div className="bookingWrapper">
        <DatePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
      <div className="bookingWrapper2">
        <div className="selectedDate">
          {selectedDate?.day && <h1>{selectedDate.day}</h1>}
          {selectedDate?.month && <h1>{selectedDate.month}</h1>}
        </div>
        {error ? (
          <>
            <h1 className="messageDoc">
              <BlockIcon fontSize="large" />
            </h1>
            <h2 className="messageDoc">Not Working Today</h2>
          </>
        ) : null}
        {availableMeetings?.times?.length == 0 && !error ? (
          <h1 className="messageDoc">No Meetings Left 😢 </h1>
        ) : null}
        {!availableMeetings?.times && (
          <h1 className="messageDoc">No Meetings Left😢 </h1>
        )}
        {!error &&
          availableMeetings?.times?.map((meeting, index: number) => {
            return (
              <div key={meeting.startTime + index} className="meeting">
                <div className="leftSide">
                  <div className="dateTime1">
                    <p>{selectedDate?.day}</p>
                    <p>{selectedDate?.month.substring(3, -1)}</p>
                  </div>
                  <div className="dateTime2">
                    <p>
                      {meeting.startTime}:00 - {meeting.endTime}:00
                    </p>
                    <p>
                      Friday • {meeting.startTime} AM •{" "}
                      {(meeting.endTime - meeting.startTime) * 60} minutes{" "}
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
                      meeting.endTime,
                      meeting.startTime
                    );
                    const tempMeetings: ITimeSpan[] = [];
                    availableMeetings.times.forEach((e) => {
                      if (e.endTime != meeting.endTime) {
                        tempMeetings.push(e);
                      }
                    });
                    setAvailableMeetings((prev) => {
                      return { day: prev?.day!, times: tempMeetings };
                    });
                  }}
                  className="book"
                >
                  Book
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BookingPage;
