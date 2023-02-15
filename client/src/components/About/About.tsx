import "./app.scss";
import { motion } from "framer-motion";
import image from "../../assets/about.jpg";
import SmallInfo from "../SmallInfo/SmallInfo";
import OurTeam from "../OurTeam/OurTeam";
const About = () => {
  return (
    <motion.div id="about" className="howWrapper">
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
      <SmallInfo />
    </motion.div>
  );
};

export default About;
