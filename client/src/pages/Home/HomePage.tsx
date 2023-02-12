import "./app.scss";
import image from "../../assets/doctor.jpg";
import About from "../../components/About/About";
import { motion } from "framer-motion";
const HomePage = () => {
  return (
    <div className="bigWrapper">
      <motion.div className="pageWrapper">
        <motion.div
        className="first"
          initial={{ opacity: 0,y:-200}}
          transition={{ duration: 2 }}
          whileInView={{ opacity: 1,y:0 }}
        >
          <h1>
            Providing the best medical care and
            <span> consultation</span>
          </h1>
          <p>
            We provide the best consultation to you with the <br /> best doctors
            in the field
          </p>
          <button>Make an Appoitment</button>
        </motion.div>
        <div>
        <motion.img
           initial={{ opacity: 0,y:200}}
           transition={{ duration: 2 }}
           whileInView={{ opacity: 1,y:0 }}
          src={image}
          alt="image of doctors"
        />
        </div>
      </motion.div>
      <About />
    </div>
  );
};

export default HomePage;
