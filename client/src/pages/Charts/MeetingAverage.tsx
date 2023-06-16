import React from "react";
import { User } from "../../types/type";

const MeetingAverage = ({ users }: { users: User[] }) => {
  return (
    <div className="bestAvg">
      <h2>Top Meeting Average</h2>
      <div className="average">
        {users
          .filter((one) => one.role == 1)
          .sort((one, two) => {
            return (
              one.Duration.totalDuration / one.Duration.meetingsAmount -
              two.Duration.totalDuration / two.Duration.meetingsAmount
            );
          })
          .reverse()
          .map((one, index) => {
            return (
              <div className={`singleRow ${index == 0 && "top"}`} key={one._id}>
                {one.fName + " " + one.lName + " "}
                <span>
                  {one.Duration.meetingsAmount != 0
                    ? Math.floor(
                        one.Duration.totalDuration / one.Duration.meetingsAmount
                      )
                    : "0"}{" "}
                </span>
                Minutes
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MeetingAverage;
