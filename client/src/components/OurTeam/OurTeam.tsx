import "./app.scss";
import { motion } from "framer-motion";
import Image1 from "../../assets/doctor1.jpg";
import Image2 from "../../assets/doctor2.jpg";
import Image3 from "../../assets/doctor3.jpg";
import Image4 from "../../assets/doctor4.jpg";
import Image5 from "../../assets/doctor5.jpg";
import Image6 from "../../assets/doctor6.jpg";
const OurTeam = () => {
  return (
    <motion.div
      initial={{ y: -200, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="OurTeamWrapper"
    >
      <div>
        <h3>Our Team</h3>
      </div>
      <div className="doctorsGrid">
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image1} alt="" />
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image2} alt="" />
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image3} alt="" />
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image5} alt="" />
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image6} alt="" />
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image4} alt="" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OurTeam;
