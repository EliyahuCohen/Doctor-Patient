import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./premodal.scss";
import { IMedication, IPrescription, User } from "../../types/type";
import { FaRegWindowClose } from "react-icons/fa";
import { CiCircleRemove, CiPill } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";
import { TfiWrite } from "react-icons/tfi";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { usePrescriptions } from "../../hooks/usePrescriptions";

const PrescriptionModal = ({
  user,
  setUser,
}: {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) => {
  const { user: theUser } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const { submitPrescription } = usePrescriptions();
  const currentDate = new Date();
  const expirationDate = new Date(
    currentDate.getTime() + 14 * 24 * 60 * 60 * 1000
  );
  const formattedExpirationDate = expirationDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [prescription, setPrescription] = useState<IPrescription>({
    doctorId: theUser!._id,
    doctorName: theUser?.fName + " " + theUser?.lName,
    endDate: new Date(formattedExpirationDate),
    medications: [],
    patinetId: user!._id,
    title: "",
  });

  function addMedication() {
    const newMedication: IMedication = {
      dosage: "",
      frequency: "",
      name: "",
      instructions: "",
    };
    setPrescription({
      ...prescription,
      medications: [...prescription.medications, newMedication],
    });
  }
  function removeMedication(index: number) {
    const newMedications = [...prescription.medications];
    newMedications.splice(index, 1);
    setPrescription({
      ...prescription,
      medications: newMedications,
    });
  }

  function updateMedication(index: number, medic: IMedication) {
    const newMedications = [...prescription.medications];
    newMedications[index] = medic;
    setPrescription((prevPrescription) => ({
      ...prevPrescription,
      medications: newMedications,
    }));
  }

  return (
    <div className="prescriptionWrapper">
      <div className="modal">
        <div className="firstOne">
          <FaRegWindowClose
            className="closeIcon"
            onClick={() => setUser(null)}
          />
          <p>
            New Prescription for{" "}
            <span>
              <strong>
                {user?.fName} {user?.lName}
              </strong>
            </span>
          </p>
          <div className="inputs">
            <input
              className="firstInput"
              type="text"
              value={prescription.title}
              onChange={(e) =>
                setPrescription({ ...prescription, title: e.target.value })
              }
              placeholder="Enter the description title"
            />
            <div className="spiltTwo">
              <p className="noticeMessage">
                <strong>Notice:</strong> the prescription will expire in two
                weeks
              </p>
            </div>
            <div className="listOfMedicationModal">
              <div className="connectionLinks">
                <Link to="">
                  <AiOutlineMail title="Email" />
                </Link>
                <Link to={`/communication/${user?._id}`}>
                  <IoLogoWhatsapp title="Whatsapp" />
                </Link>
              </div>
              <p style={{ fontSize: "medium" }}>
                <strong>
                  <CiPill /> List of Medications (
                  {prescription.medications.length})
                </strong>
              </p>
              <div className="medicationsArr">
                <div className="addMedicationIcon">
                  <TfiWrite title="Add Medication" onClick={addMedication} />
                </div>
              </div>
              <div className="listOfMedications">
                {prescription.medications.map(
                  (med: IMedication, index: number) => {
                    return (
                      <div key={index}>
                        <form>
                          <CiCircleRemove
                            onClick={() => removeMedication(index)}
                            className="deleteMedication"
                          />
                          <input
                            className="medicationName"
                            type="text"
                            value={med.name}
                            placeholder="Name of prescribed medication"
                            onChange={(e) => {
                              const newObj = { ...med, name: e.target.value };
                              updateMedication(index, newObj);
                            }}
                          />
                          <input
                            type="text"
                            placeholder="How often should this medication be taken"
                            value={med.frequency}
                            onChange={(e) => {
                              const newObj = {
                                ...med,
                                frequency: e.target.value,
                              };
                              updateMedication(index, newObj);
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Enter dosage amount"
                            value={med.dosage}
                            onChange={(e) => {
                              const newObj = { ...med, dosage: e.target.value };
                              updateMedication(index, newObj);
                            }}
                          />
                          <textarea
                            className="instructionsText"
                            placeholder="Any additional instructions or notes"
                            value={med.instructions}
                            onChange={(e) => {
                              const newObj = {
                                ...med,
                                instructions: e.target.value,
                              };
                              updateMedication(index, newObj);
                            }}
                          />
                        </form>
                      </div>
                    );
                  }
                )}
              </div>
              {prescription.medications.length > 0 &&
                prescription.title.length > 3 &&
                prescription.medications.filter((one) => one.name.length <= 0)
                  .length == 0 &&
                prescription.medications.filter((one) => one.dosage.length <= 0)
                  .length == 0 &&
                prescription.medications.filter(
                  (one) => one.frequency.length <= 0
                ).length == 0 &&
                prescription.medications.filter(
                  (one) => one.instructions.length <= 0
                ).length == 0 && (
                  <div className="subBtn">
                    <button
                      onClick={() => {
                        submitPrescription(prescription).then(() =>
                          setUser(null)
                        );
                      }}
                    >
                      Submit
                    </button>
                    <button onClick={() => setUser(null)}>Cancel</button>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PrescriptionModal);
