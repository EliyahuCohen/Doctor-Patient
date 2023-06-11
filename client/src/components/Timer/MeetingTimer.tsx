import React, { useEffect } from "react";
import "./timer.scss";
const MeetingTimer = ({
  meetingDuration,
  setMeetingDuration,
}: {
  meetingDuration: number;
  setMeetingDuration: React.Dispatch<React.SetStateAction<number>>;
}) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setMeetingDuration((prevDuration) => prevDuration + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="timer">
      <p> {formatDuration(meetingDuration)}</p>
    </div>
  );
};

// Helper function to format the duration as HH:MM:SS
const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export default MeetingTimer;
