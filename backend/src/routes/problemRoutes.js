import { Router } from "express";
import { addProblem, getProblem, updateProblem, deleteProblem } from "../controllers/problemController.js";
import { startTimer, stopTimer } from "../controllers/timerController.js";

const router = Router();
router.post("/", addProblem);
router.get("/:id", getProblem);
router.put("/:id", updateProblem);
router.delete("/:id", deleteProblem);
router.post("/:id/timer/start", startTimer);
router.post("/:id/timer/stop", stopTimer);

export default router;
