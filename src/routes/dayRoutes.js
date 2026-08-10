import { Router } from "express";
import { createDay, getDay, listDays } from "../controllers/dayController.js";

const router = Router();
router.post("/", createDay);
router.get("/", listDays);
router.get("/:dayNumber", getDay);

export default router;
