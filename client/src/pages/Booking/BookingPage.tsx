import "./app.scss";
import { useState } from "react";
import DatePicker from "../../components/DatePicker/DatePicker";

const BookingPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<{
    month: string;
    day: number;
  } | null>(null);
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
      </div>
    </div>
  );
};

export default BookingPage;
