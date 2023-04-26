import express from "express";
import { requiredAuthentication } from "../Middlewares/RequireAuth";
import {
  deletePrescription,
  getPrescriptions,
  newPrescription,
  updatePrescription,
} from "../Controllers/Prescriptions.controller";
const router = express.Router();

router.use(requiredAuthentication);
router.get("/prescriptions", getPrescriptions);
router.post("/new-prescription", newPrescription);
router.patch("/update-prescription/:id", updatePrescription);
router.delete("/delete-prescription/:id", deletePrescription);

export default router;
