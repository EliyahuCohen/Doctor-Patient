import "./ourteam.scss";
import { lazy } from "react";
import { motion } from "framer-motion";
import Image1 from "../../assets/doctor1.webp";
import Image2 from "../../assets/doctor2.webp";
import Image3 from "../../assets/doctor3.webp";
import Image4 from "../../assets/doctor4.webp";
import Image5 from "../../assets/doctor5.webp";
import Image6 from "../../assets/doctor6.webp";

const LazyImage = lazy(() => import("../LazyImage/LasyImage"));
import React from "react";
const OurTeam = () => {
  return (
    <motion.div
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="OurTeamWrapper"
    >
      <div>
        <h3>Our Team</h3>
      </div>
      <div className="doctorsGrid">
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="oneDoctor"
        >
          <img src={Image1} alt="" height={400} width={400} />
          <div className="doctorInfo">
            <p>Dr.Eliyahu Cohen</p>
            <strong>Optometrist</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="oneDoctor"
        >
          <img src={Image2} alt="" height={400} width={400} />
          <div className="doctorInfo">
            <p>Dr.Rachel Jones</p>
            <strong>Family Doctor</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="oneDoctor"
        >
          <img src={Image3} alt="" height={400} width={400} />
          <div className="doctorInfo">
            <p>Dr.John Watson</p>
            <strong>Dentist</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="oneDoctor"
        >
          <img src={Image5} alt="" height={400} width={400} />
          <div className="doctorInfo">
            <p>Shira Cole</p>
            <strong>Nurse</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="oneDoctor"
        >
          <img src={Image6} alt="" height={400} width={400} />
          <div className="doctorInfo">
            <p>Dr.Lydia Leen</p>
            <strong>Chiropractor</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="oneDoctor"
        >
          <img src={Image4} alt="" height={400} width={400} />
          <div className="doctorInfo">
            <p>Dr.Robert Glan</p>
            <strong>Pediatrician</strong>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default React.memo(OurTeam);
