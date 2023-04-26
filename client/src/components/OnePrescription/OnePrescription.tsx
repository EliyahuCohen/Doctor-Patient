import React from "react";
import "./app.scss";
import { CgPill } from "react-icons/cg";
import { IPrescription } from "../../types/type";
import { format } from "date-fns";
const OnePrescription = ({ pre }: { pre: IPrescription }) => {
  return (
    <div className="onePrescription">
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
                <p className="grayColor">{med.instructions}</p>
                <p className="usage">
                  <span>{med.frequency}</span> every time use only{" "}
                  <span>{med.dosage}</span>
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
    </div>
  );
};

export default React.memo(OnePrescription);
