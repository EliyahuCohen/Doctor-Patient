import "./app.scss";
import { useState, useEffect } from "react";
import DatePicker from "../../components/DatePicker/DatePicker";
import BlockIcon from "@mui/icons-material/Block";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useSchedual } from "../../hooks/useSchedual";
import { useParams } from "react-router-dom";
import { Schedule } from "../../types/type";
import OneMeeting from "../../components/OneMeeting/OneMeeting";

const BookingPage = () => {
  const { id } = useParams();
  const [error, setError] = useState<boolean>(false);
  const [availableMeetings, setAvailableMeetings] = useState<Schedule | null>(
    null
  );
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<{
    month: string;
    day: number;
  } | null>({ month: (date.getMonth() + 1).toString(), day: date.getDate() });
  const { getMeetings } = useSchedual();
  useEffect(() => {
    setLoading(true);
    const d = new Date(`${selectedDate?.month}-${selectedDate?.day}-2023`);
    getMeetings(d, id!, d.getDay(), setAvailableMeetings, setError, setLoading);
  }, [selectedDate]);
  return (
    <div className="wrapperDate">
      <div className="bookingWrapper">
        <DatePicker setSelectedDate={setSelectedDate} />
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
        <div className="loadingIcon">
          {!error && loading && <HourglassEmptyIcon fontSize="large" />}
        </div>
        {!error &&
          availableMeetings?.times?.map((meeting, index: number) => {
            return (
              <OneMeeting
                availableMeetings={availableMeetings}
                date={date}
                id={id}
                index={index}
                meeting={meeting}
                selectedDate={selectedDate}
                setAvailableMeetings={setAvailableMeetings}
                key={meeting.endTime + index}
              />
            );
          })}
      </div>
    </div>
  );
};

export default BookingPage;
