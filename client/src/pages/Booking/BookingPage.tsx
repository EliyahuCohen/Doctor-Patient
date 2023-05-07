import "./app.scss";
import { useState, useEffect, memo } from "react";
import DatePicker from "../../components/DatePicker/DatePicker";
import { useSchedual } from "../../hooks/useSchedual";
import { useParams } from "react-router-dom";
import { Schedule } from "../../types/type";
import OneMeeting from "../../components/OneMeeting/OneMeeting";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { TbHourglassEmpty } from "react-icons/tb";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
const BookingPage = () => {
  const { id } = useParams();
  const [error, setError] = useState<boolean>(true);
  const [limit, setLimit] = useState<number>(5);
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
    <div>
      <div className="spaceForBtn">
        <GoBackButton backgroundColor="#ffebea" whereTo="dashboard" />
      </div>
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
                <TbHourglassEmpty fontSize="large" />
              </h1>
              <h2 className="messageDoc">Not a Working Today</h2>
            </>
          ) : null}
          {availableMeetings?.times?.length == 0 && !error ? (
            <div className="notMore">
              <h1 className="messageDoc">No Meetings Available </h1>
              <TbHourglassEmpty className="emptyIcon" />
            </div>
          ) : null}
          {!availableMeetings?.times && (
            <div className="notMore">
              <h1 className="messageDoc">No Meetings Available </h1>
              <TbHourglassEmpty className="emptyIcon" />
            </div>
          )}
          <div className="loadingIcon">
            {!error && loading && (
              <AiOutlineLoading3Quarters fontSize="large" />
            )}
          </div>
          {!error &&
            availableMeetings?.times?.map((meeting, index: number) => {
              if (index < limit) {
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
              }
            })}
          {!error &&
            availableMeetings?.times &&
            availableMeetings?.times.length > 5 && (
              <div className="moreBtn">
                {limit == 5 ? (
                  <MdExpandMore
                    className="icon"
                    title="More Meetings"
                    fontSize="medium"
                    onClick={() => setLimit(availableMeetings!.times!.length)}
                  />
                ) : (
                  <MdExpandLess
                    className="icon"
                    title="Less Meetings"
                    onClick={() => setLimit(5)}
                    fontSize="medium"
                  />
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default memo(BookingPage);
