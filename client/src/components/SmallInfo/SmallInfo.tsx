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
        <span>1k+</span>
        <p>Patients Beds</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span>20k+</span>
        <p>Happy Patients</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span>700</span>
        <p>Doctors & Nurse</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ cursor: "pointer" }}
      >
        <span>15</span>
        <p>Year Experience</p>
      </motion.div>
    </motion.div>
  );
};

export default SmallInfo;
