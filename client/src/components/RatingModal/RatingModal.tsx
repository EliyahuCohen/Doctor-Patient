import React from "react";
import "./app.scss";
import { IoMdClose } from "react-icons/io";
const RatingModal = ({
  setModalOpen,
  modalText,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalText: string;
}) => {
  return (
    <div className="ratingModal">
      <div className="innerModal">
        <IoMdClose
          onClick={() => setModalOpen(false)}
          className="iconPostion"
        />
        <h1>{modalText}</h1>
      </div>
    </div>
  );
};

export default RatingModal;
