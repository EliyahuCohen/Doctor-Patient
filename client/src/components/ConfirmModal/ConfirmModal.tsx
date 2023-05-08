import React from "react";
import "./confirm.scss";
import { motion } from "framer-motion";
import { ScheduleDay } from "../../types/type";
import { useSchedual } from "../../hooks/useSchedual";

const ConfirmModal = ({
  daysList,
  setModalOpen,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  daysList: ScheduleDay[];
}) => {
  const { postSchedual } = useSchedual();
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="confirmWrapper"
    >
      <div className="AlertText">
        <div className="innerDiv">
          <p>
            All of the already schedualed <br />
            meetings are going to exists but from now on it won't
          </p>
          <div className="theBtns">
            <button
              onClick={() => {
                postSchedual(daysList).then(() => setModalOpen(false));
              }}
            >
              Confirm
            </button>
            <button onClick={() => setModalOpen(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConfirmModal;
