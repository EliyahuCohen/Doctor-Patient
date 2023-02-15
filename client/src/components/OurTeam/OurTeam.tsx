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
          <div className="doctorInfo">
            <p>Dr.Eliyahu Cohen</p>
            <strong>Optometrist</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image2} alt="" />
          <div className="doctorInfo">
            <p>Dr.Rachel Jones</p>
            <strong>Family Doctor</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image3} alt="" />
          <div className="doctorInfo">
            <p>Dr.John Watson</p>
            <strong>Dentist</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image5} alt="" />
          <div className="doctorInfo">
            <p>Shira Cole</p>
            <strong>Nurse</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image6} alt="" />
          <div className="doctorInfo">
            <p>Dr.Lydia Leen</p>
            <strong>Chiropractor</strong>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0.5 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="oneDoctor"
        >
          <img src={Image4} alt="" />
          <div className="doctorInfo">
            <p>Dr.Lydia Leen</p>
            <strong>Pediatrician</strong>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OurTeam;
