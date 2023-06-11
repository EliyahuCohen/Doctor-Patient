import React from "react";
import "./completedMeetingModal.scss";
import { useMeetings } from "../../hooks/useMeetings";
const CompletedMeetingModal = ({
  setModal,
  meetingID,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  meetingID: string;
}) => {
  const { meetingCompleted } = useMeetings();
  return (
    <div className="completedMeetingModal">
      <h1>Have you completed the meeting?</h1>
      <div>
        <button
          onClick={() => {
            setModal(false);
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => {
            meetingCompleted(meetingID);
            setModal(false);
          }}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CompletedMeetingModal;
