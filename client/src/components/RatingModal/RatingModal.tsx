import React, { useState } from "react";
import "./rating.scss";
import { IoMdClose } from "react-icons/io";
import { AiOutlineStar } from "react-icons/ai";
import { useFeedbacks } from "../../hooks/useFeedbacks";
import { useDispatch } from "react-redux";
import { newMessage } from "../../features/messagesSlice";
const RatingModal = ({
  setModalOpen,
  modalText,
  setDoctorId,
  doctorId,
}: {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modalText: string;
  setDoctorId: React.Dispatch<React.SetStateAction<string>>;
  doctorId: string;
}) => {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [feedback, setFeedback] = useState<string>("");
  const { postFeedback } = useFeedbacks();
  const dispatch = useDispatch();
  return (
    <div className="ratingModal">
      <div className="innerModal">
        <IoMdClose
          onClick={() => setModalOpen(false)}
          className="iconPostion"
        />
        <h2 className="title">Give feedback</h2>
        <p>How was the meeting with Doctor {modalText}?</p>
        <div className="ratingStars">
          {[...Array(5)].map((_, index) => {
            return (
              <AiOutlineStar
                fill={(5 - index - 1 < rating && "gold") || ""}
                onClick={() => setRating((5 - index) as 1 | 2 | 3 | 4 | 5)}
                title={`rating ${5 - index}`}
                className="star"
                key={index}
              />
            );
          })}
        </div>
        <p className="theRating">{rating}</p>
        <div className="bottomCommentSection">
          <p>Care to share more about your experience?</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={`The meeting with doctor ${modalText}`}
          ></textarea>
          <div className="btnModal">
            <button onClick={() => setModalOpen(false)} className="cancelBtn">
              Cancel
            </button>
            <button
              onClick={() => {

                postFeedback(feedback, doctorId, rating).then(() => {
                  setModalOpen(false);
                  setDoctorId("");
                  dispatch(
                    newMessage({
                      id: crypto.randomUUID(),
                      message: "Feedback posted successfully",
                      senderId: crypto.randomUUID(),
                      senderName: "System",
                      time: 3000,
                      type: "MESSAGE",
                    })
                  );
                });

              }}
              className={`publishbtn`}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
