import "./app.scss";
import { useState, useEffect } from "react";
import DatePicker from "../../components/DatePicker/DatePicker";
import { useSchedual } from "../../hooks/useSchedual";
import { useParams } from "react-router-dom";
import { ITimeSpan, Schedule } from "../../types/type";
import AddIcon from "@mui/icons-material/Add";

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
  useEffect(() => {
    const d = new Date(`${selectedDate?.month}-${selectedDate?.day}-2023`);
    getMeetings(date, id!, d.getDay(), setAvailableMeetings, setError);
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
          <h1 className="messageDoc">The doctor is not working today😢</h1>
        ) : null}
        {availableMeetings?.times?.length == 0 && !error ? (
          <h1 className="messageDoc">No Meetings left 😢 </h1>
        ) : null}
        {!availableMeetings?.times && (
          <h1 className="messageDoc">No Meetings left😢 </h1>
        )}
        {!error &&
          availableMeetings?.times?.map((meeting, index: number) => {
            return (
              <div key={meeting.startTime + index} className="meeting">
                <div className="innerDiv">
                  <strong className="time">
                    {meeting.startTime}:00 - {meeting.endTime}:00
                  </strong>
                  <p className="time">
                    <strong>
                      {(meeting.endTime - meeting.startTime) * 60}
                    </strong>{" "}
                    min
                  </p>
                </div>
                <div>
                  <p
                    onClick={(e) => {
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
                    className="schedual"
                  >
                    Schedual Appointment
                  </p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BookingPage;
