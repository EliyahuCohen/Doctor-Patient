import "./app.scss";
import { useState } from "react";
import DatePicker from "../../components/DatePicker/DatePicker";

const BookingPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  return (
    <div className="bookingWrapper">
      <DatePicker />
    </div>
  );
};

export default BookingPage;
