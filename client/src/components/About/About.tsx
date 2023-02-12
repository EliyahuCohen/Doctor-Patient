import "./app.scss";
import { motion } from "framer-motion";
import image from "../../assets/about.jpg";
const About = () => {
  return (
    <motion.div className="howWrapper">
      <div className="divs">
        <motion.img
          initial={{ x: -250, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          src={image}
          alt="about section picture"
        />
        <motion.div
          initial={{ x: 250, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2>About Us</h2>
          <p>
            Welcome to ABC Health Care! We are a leading provider of quality
            medical services in the community, dedicated to improving the health
            and well-being of our patients.
          </p>
          <p>
            Our Mission: At ABC Health Care, our mission is to provide
            compassionate, patient-centered care that improves the health and
            well-being of our community. We believe in treating each patient
            with dignity and respect, and in delivering the highest standard of
            medical care.
          </p>
          <p>
            Our History: ABC Health Care was founded in 2000 with the goal of
            providing accessible and affordable healthcare to the local
            community. Over the years, we have grown to become one of the most
            respected healthcare providers in the area, offering a wide range of
            services to meet the needs of our patients.
          </p>
          <button>Learn More</button>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        whileInView={{ opacity: 1 }}
        className="squares"
      >
        <div>
          <span>1k+</span>
          <p>Patients Beds</p>
        </div>
        <div>
          <span>20k+</span>
          <p>Happy Patients</p>
        </div>
        <div>
          <span>700</span>
          <p>Doctors & Nurse</p>
        </div>
        <div>
          <span>15</span>
          <p>Year Experience</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;
