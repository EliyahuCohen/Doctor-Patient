import React from "react";
import { User } from "../../types/type";
import { motion } from "framer-motion";
import { AiOutlineStar } from "react-icons/ai";
import { Link } from "react-router-dom";

const BlockedDoctors = ({ users }: { users: User[] }) => {
  return (
    <motion.div>
      {users
        .filter((one) => !one.approved)
        .map((one, index) => {
          return (
            <Link to={`/profile/${one._id}`} key={index + one._id}>
              <motion.div
                title="Go to Doctor"
                className="theDoctor"
                initial={{ x: -100 * index + 1, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <p>{one.fName + " " + one.lName}</p>
                <p>{one.location}</p>
                <p>{one.speciality}</p>
                <p>
                  {one.userRating.sum / one.userRating.votes || "Not Rated"}
                  {one.userRating.sum / one.userRating.votes ||
                  one.userRating.sum / one.userRating.votes == 0 ? (
                    <AiOutlineStar className="starIcon" />
                  ) : null}
                </p>
              </motion.div>
            </Link>
          );
        })}
    </motion.div>
  );
};

export default BlockedDoctors;
