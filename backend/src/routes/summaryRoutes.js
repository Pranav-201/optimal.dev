import { Router } from "express";
import {
  generateDailySummary,
  generateWeeklySummary,
  generateMonthlySummary,
  listSummaries,
} from "../controllers/summaryController.js";

const router = Router();
router.post("/daily", generateDailySummary);
router.post("/weekly", generateWeeklySummary);
router.post("/monthly", generateMonthlySummary);
router.get("/", listSummaries);

export default router;
