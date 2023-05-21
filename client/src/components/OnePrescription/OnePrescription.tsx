import React from "react";
import "./onepre.scss";
import { CgPill } from "react-icons/cg";
import { IPrescription } from "../../types/type";
import { format } from "date-fns";
import { motion } from "framer-motion";
const OnePrescription = ({
  pre,
  index,
}: {
  index: number;
  pre: IPrescription;
}) => {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className="onePrescription"
    >
      <div className="firstLine">
        <CgPill />
        <strong className="medTitle">{pre.title}</strong>
      </div>
      <div className="listOfMedication">
        <p className="list">List of medication:</p>
        <div className="medications">
          {pre.medications.map((med, index) => {
            return (
              <div className="oneMed" key={med.dosage + med.name + index}>
                <strong>- {med.name}</strong>
                <p className="usage">
                  <span>{med.frequency}</span> every time use only{" "}
                  <span>{med.dosage}</span>
                </p>
                <p className="grayColor">
                  <b>Instructions:</b> {med.instructions}
                </p>
              </div>
            );
          })}
        </div>
        <div className="endLine">
          <p className="treatingDoctor">
            Prescribed by <span>{pre.doctorName}</span>{" "}
          </p>
          <p className="expriesIn">
            Expires at {format(new Date(pre.endDate), "dd/MM/yyyy")}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(OnePrescription);
