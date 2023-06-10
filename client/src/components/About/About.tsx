import "./about.scss";
import { motion } from "framer-motion";
import image from "../../assets/about.webp";
import SmallInfo from "../SmallInfo/SmallInfo";
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
            Welcome to Care Connect! <br/>We are a leading provider of quality
            medical services in the community, dedicated to improving well-being of our patients and connecting you to a better health.
          </p>
          <p>
            Our Mission: At Care Connect, we are on a mission to revolutionize healthcare. 
            By connecting patients with premier doctors and offering streamlined services,
             we provide accessible and innovative solutions. Through our cutting-edge platform,
              we facilitate seamless communication and convenient access to medical advice. 
              We are committed to transforming healthcare and fostering optimal well-being.
          </p>
          <p>
            Our History: Since our establishment in 2012, Care Connect has been a pioneer in digital healthcare. 
            We have revolutionized the way patients and doctors connect, leveraging technology to bridge the gap. 
            With our user-friendly platform, extensive network of top-tier medical professionals, 
            and enhanced patient-doctor interactions, we continue to lead the industry.
            We are committed to driving positive change and empowering individuals on their path to better health.
          </p>
          <button>Learn More</button>
        </motion.div>
      </div>
      <SmallInfo />
    </motion.div>
  );
};

export default About;
