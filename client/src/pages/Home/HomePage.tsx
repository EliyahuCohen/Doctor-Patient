import "./app.scss";
import image from "../../assets/doctor.jpg";
import About from "../../components/About/About";
import { motion } from "framer-motion";
import OurTeam from "../../components/OurTeam/OurTeam";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserType } from "../../features/userSlice";
import { newMessage } from "../../features/messagesSlice";
const HomePage = () => {
  const { user } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const dispatch = useDispatch();
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
            Providing the best medical care and
            <span> consultation</span>
          </h1>
          <p>
            We provide the best consultation to you with the <br /> best doctors
            in the field
          </p>
          {user ? (
            <Link to="/dashboard">
              <button>Make an Appoitment</button>
            </Link>
          ) : (
            <button
              onClick={() => {
                dispatch(
                  newMessage({
                    id: crypto.randomUUID(),
                    message: "Have to Login to use",
                    senderId: crypto.randomUUID(),
                    senderName: "System",
                    time: 5000,
                    type: "SYSTEM",
                  })
                );
              }}
            >
              Make an Appoitment
            </button>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 200 }}
          transition={{ duration: 1 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.img src={image} alt="image of doctors" />
        </motion.div>
      </motion.div>
      <OurTeam />
      <About />
    </div>
  );
};

export default HomePage;
