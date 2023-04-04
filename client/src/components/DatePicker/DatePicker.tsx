import "./app.scss";
import { useState, useEffect } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useDispatch } from "react-redux";
import { newMessage } from "../../features/messagesSlice";
interface IMyDate {
  monthName: string;
  maxDays: 28 | 29 | 30 | 31;
}

const DatePicker = ({
  setSelectedDate,
  selectedDate,
}: {
  setSelectedDate: React.Dispatch<
    React.SetStateAction<{ month: string; day: number } | null>
  >;
  selectedDate: { month: string; day: number } | null;
}) => {
  const date = new Date();
  const [year, setYear] = useState<number>(date.getFullYear());
  const [day, setDay] = useState<number>(date.getDay());
  const [month, setMonth] = useState<number>(date.getMonth());
  const [dayMonth, setDayMonth] = useState<number>(date.getDate() - 1);
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dates: IMyDate[] = [
    {
      monthName: months[0],
      maxDays: 31,
    },
    {
      monthName: months[1],
      maxDays: date.getFullYear() % 4 == 0 ? 29 : 28,
    },
    {
      monthName: months[2],
      maxDays: 31,
    },
    {
      monthName: months[3],
      maxDays: 30,
    },
    {
      monthName: months[4],
      maxDays: 31,
    },
    {
      monthName: months[5],
      maxDays: 30,
    },
    {
      monthName: months[6],
      maxDays: 31,
    },
    {
      monthName: months[7],
      maxDays: 31,
    },
    {
      monthName: months[8],
      maxDays: 30,
    },
    {
      monthName: months[9],
      maxDays: 31,
    },
    {
      monthName: months[10],
      maxDays: 30,
    },
    {
      monthName: months[11],
      maxDays: 31,
    },
  ];
  useEffect(() => {
    setSelectedDate({ month: months[month], day: date.getDate() });
  }, []);
  const dispatch = useDispatch();
  return (
    <div className="info">
      <div className="headerWordsWrapper">
        <div className="headerWords">
          <strong>{months[month]}</strong>
          <strong style={{ marginLeft: "1rem" }}>{year}</strong>
        </div>
        <div className="navigationBtns">
          <button
            onClick={(e) =>
              setMonth((prev) => {
                if (prev - 1 >= 1 && prev - 1 >= date.getMonth()) {
                  return prev - 1;
                } else {
                  dispatch(
                    newMessage({
                      id: crypto.randomUUID(),
                      message: "Can't go back less than the current date",
                      senderId: crypto.randomUUID(),
                      senderName: "System",
                      time: 4000,
                      type: "OVERDATE",
                    })
                  );
                  return prev;
                }
              })
            }
          >
            <NavigateBeforeIcon className="navigationIcon" />
          </button>
          <button
            onClick={(e) => {
              let value = month;
              if (value + 1 <= 11) {
                value += 1;
              } else {
                dispatch(
                  newMessage({
                    id: crypto.randomUUID(),
                    message: "Can't go fowared more than the end of year date",
                    senderId: crypto.randomUUID(),
                    senderName: "System",
                    time: 4000,
                    type: "OVERDATE",
                  })
                );
              }
              setMonth(value);
            }}
          >
            <NavigateNextIcon className="navigationIcon" />
          </button>
        </div>
      </div>
      <div className="calanderWrapper">
        <div className="dateDays">
          {["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"].map(
            (moth: string, index: number) => {
              return (
                <span
                  className={`${index == day ? "selected" : ""}`}
                  key={moth + index}
                >
                  {moth}
                </span>
              );
            }
          )}
        </div>
        <div className="dateNumber">
          {[...Array(firstDayOfWeek)].map((date, index) => {
            return (
              <span
                className="notThis"
                key={date + index + crypto.randomUUID()}
              ></span>
            );
          })}
          {Array.from(Array(dates[month].maxDays)).map((d, index) => {
            const compDate = new Date(`${month + 1}-${index + 1}-${year}`);
            return (
              <span
                className={`${
                  index == dayMonth && compDate.getMonth() == date.getMonth()
                    ? "selected"
                    : compDate < date || compDate.getDay() == 6
                    ? "over"
                    : ""
                }`}
                onClick={() => {
                  if (
                    (date.getMonth() <= compDate.getMonth() &&
                      date.getDate() <= compDate.getDate()) ||
                    date.getMonth() < compDate.getMonth()
                  ) {
                    setSelectedDate({
                      month: months[month],
                      day: index + 1,
                    });
                  }
                }}
                key={d + index + crypto.randomUUID()}
              >
                {index + 1}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
