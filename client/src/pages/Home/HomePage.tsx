import "./app.scss";
import image from "../../assets/doctor.webp";
import About from "../../components/About/About";
import { motion } from "framer-motion";
import OurTeam from "../../components/OurTeam/OurTeam";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
const HomePage = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const navigate = useNavigate();
  return (
    <div className="bigWrapper">
      <motion.div className="pageWrapper">
        <motion.div
          className="first"
          initial={{ opacity: 0, y: -200 }}
          transition={{ duration: 1 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>
          Transforming Healthcare <span>Experiences</span> with Expert Medical Care and
            <span> Consultation</span>
          </h1>
          {/* <p>
            We provide the best consultation to you with the <br /> best doctors
            in the field
          </p> */}
          <p>
          Experience healthcare at its finest through our platform, where we connect you with top-tier doctors who offer unparalleled expertise and personalized care.
          </p>
          {user ? (
            <Link to="/dashboard/2">
              <button>Make an Appoitment</button>
            </Link>
          ) : (
            <button
              onClick={() => {
                navigate("/signin");
              }}
            >
              Book an Appointment
            </button>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 200 }}
          transition={{ duration: 1 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.img
            src={image}
            height={600}
            width={600}
            alt="image of doctors"
          />
        </motion.div>
      </motion.div>
      <OurTeam />
      <About />
    </div>
  );
};

export default HomePage;
