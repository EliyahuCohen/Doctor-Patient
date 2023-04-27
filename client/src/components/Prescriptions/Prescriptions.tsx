import React, { useEffect, useState } from "react";
import "./app.scss";
import { usePrescriptions } from "../../hooks/usePrescriptions";
import { IPrescription } from "../../types/type";
import OnePrescription from "../OnePrescription/OnePrescription";
import { socket } from "../../App";
import { useDispatch } from "react-redux";

const Prescription = () => {
  const { getPrescriptions } = usePrescriptions();
  const [prescriptions, setPrescriptions] = useState<IPrescription[] | null>(
    null
  );
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on("newPrescription", (sock) => {
      setPrescriptions((prev) => [...prev!, sock]);
    });
  }, [socket]);
  useEffect(() => {
    getPrescriptions(setPrescriptions);
  }, []);

  return (
    <div className="myPrescriptions">
      <h1>My Prescription ({prescriptions?.length})</h1>
      {prescriptions && prescriptions.length == 0 && (
        <h1>
          <p
            style={{
              color: "#10a37f",
              fontSize: "0.5em",
              fontWeight: "normal",
            }}
          >
            No Available Prescriptions
          </p>
        </h1>
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
