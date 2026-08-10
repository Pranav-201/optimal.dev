import { Router } from "express";
import { createDay, getDay, listDays, deleteDay } from "../controllers/dayController.js";

const router = Router();
router.post("/", createDay);
router.get("/", listDays);
router.get("/:dayNumber", getDay);
router.delete("/:id", deleteDay);

export default router;

