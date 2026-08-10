import { Router } from "express";
import { addApproach, updateApproach, deleteApproach } from "../controllers/approachController.js";

const router = Router();
router.post("/", addApproach);
router.put("/:id", updateApproach);
router.delete("/:id", deleteApproach);

export default router;
