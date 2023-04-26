import React, { useEffect, useState } from "react";
import "./app.scss";
import { usePrescriptions } from "../../hooks/usePrescriptions";
import { IPrescription } from "../../types/type";
import OnePrescription from "../OnePrescription/OnePrescription";

const Prescription = () => {
  const { getPrescriptions } = usePrescriptions();
  const [prescriptions, setPrescriptions] = useState<IPrescription[] | null>(
    null
  );
  useEffect(() => {
    getPrescriptions(setPrescriptions);
  }, []);
  return (
    <div className="myPrescriptions">
      <h1>My Prescription ({prescriptions?.length})</h1>
      {prescriptions && prescriptions.length == 0 && (
        <p style={{ color: "#10a37f" }}>No Available Prescriptions</p>
      )}
      <div className="thePrescriptions">
        {prescriptions?.map((pre, index) => {
          return (
            <OnePrescription
              key={pre.doctorId + pre.endDate + pre.patinetId + index}
              pre={pre}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(Prescription);
