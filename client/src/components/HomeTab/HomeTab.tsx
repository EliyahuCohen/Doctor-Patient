import React, { useEffect, useState } from "react";
import "./home.scss";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { BsChatQuote } from "react-icons/bs";
import { useQuote } from "../../hooks/useQuote";
import { motion } from "framer-motion";
import { useMeetings } from "../../hooks/useMeetings";
import { IUserStats } from "../../types/type";
const HomeTab = () => {
  const [stats, setStats] = useState<IUserStats | null>(null);
  const [quote, setQuote] = useState<{ id: number; quote: string } | null>(
    null
  );
  const { getQuote } = useQuote();
  const { getStats } = useMeetings();
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  useEffect(() => {
    getQuote(setQuote);
    getStats(user?._id!, setStats);
  }, []);
  const date = new Date();
  return (
    <div className="homeTab">
      <h1>
        <b>
          Good
          {date.getHours() < 12
            ? " Morning"
            : date.getHours() >= 12 && date.getHours() < 18
            ? " Afternoon"
            : " Evening"}
          ,
        </b>
      </h1>
      <p className="secondLineName">{user?.fName}</p>
      <p className="firstP">
        Here the information about your activity and condition
      </p>
      <div className="conditionBoxs">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="oneBox"
        >
          <b>Meetings Finished</b>
          <p className="circle">{stats?.meetingAmount}</p>
        </motion.div>
        {user?.role == 1 ? (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="oneBox"
          >
            <b>Rating</b>
            <p className="circle">{stats?.rating.toFixed(1)}</p>
          </motion.div>
        ) : null}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="oneBox"
        >
          <b>Doctors</b>
          <p className="circle">{stats?.doctorsAmount}</p>
        </motion.div>
        {user?.role == 1 ? (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="oneBox"
          >
            <b>Patients</b>
            <p className="circle">{stats?.patientsAmount}</p>
          </motion.div>
        ) : null}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="quoteOfDay"
      >
        <BsChatQuote className="quoteIcon" />
        <h2>Medical Quote of the Day</h2>
        <p>"{quote?.quote}"</p>
      </motion.div>
    </div>
  );
};

export default React.memo(HomeTab);
