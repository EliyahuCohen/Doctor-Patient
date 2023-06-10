import { motion } from "framer-motion";
const SmallInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      whileInView={{ opacity: 1 }}
      className="squares"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span>25k+</span>
        <p>Meetings booked</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span>12k+</span>
        <p>Happy Patients</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span>300+</span>
        <p>Professional Doctors</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ cursor: "pointer" }}
      >
        <span>10+</span>
        <p>Years Experience</p>
      </motion.div>
    </motion.div>
  );
};

export default SmallInfo;
