import express from "express";
import {
  signup,
  getAllUsers,
  updateUser,
  findOneUser,
  deleteUser,
  login,
  updatePermissions,
  getSystemMessages,
  getUserDoctorsAndPatients,
  getAllDoctors,
  postSchedual,
  getSchedual,
  updateDoctorsList,
  checkAccess,
  addRatingToDoctor,
  resetPasswordVerificationCodeEmailSender,
  checkIfVerificationCodeIsValidAndCorrect,
  changePassword,
} from "../Controllers/User.contoller";
import { requiredAuthentication } from "../Middlewares/RequireAuth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/reset-password", resetPasswordVerificationCodeEmailSender);
router.post("/verification", checkIfVerificationCodeIsValidAndCorrect);
router.post("/change-password", changePassword);
router.use(requiredAuthentication);
router.use("/checkAccess", checkAccess);
router.get("/all", getAllUsers);
router.get("/users", getUserDoctorsAndPatients);
router.get("/one/:id", findOneUser);
router.get("/getMessages", getSystemMessages);
router.get("/doctors", getAllDoctors);
router.delete("/delete/:id", deleteUser);
router.patch("/update/:id", updateUser);
router.patch("/updateRole/:id", updatePermissions);
router.patch("/updateDoctors/:id", updateDoctorsList);
router.patch("/updateRating", addRatingToDoctor);
router.post("/schdeual", postSchedual);
router.get("/schdeual", getSchedual);

export default router;
