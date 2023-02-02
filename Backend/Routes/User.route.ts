import express from "express";
import {
  signup,
  getAllUsers,
  updateUser,
  findOneUser,
  deleteUser,
  login,
} from "../Controllers/User.contoller";
import { requiredAuthentication } from "../Middlewares/RequireAuth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.use(requiredAuthentication);
router.get("/all", getAllUsers);
router.get("/one/:id", findOneUser);
router.delete("/delete/:id", deleteUser);
router.patch("/update/:id", updateUser);

export default router;
