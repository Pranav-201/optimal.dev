import { Day, Problem, Approach } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createDay = asyncHandler(async (req, res) => {
  const { dayNumber, date, notes } = req.body;
  const [day, created] = await Day.findOrCreate({
    where: { dayNumber, userId: req.user.id },
    defaults: { date: date || new Date(), notes, userId: req.user.id },
  });
  res.status(created ? 201 : 200).json({ success: true, data: day });
});

export const getDay = asyncHandler(async (req, res) => {
  const day = await Day.findOne({
    where: { dayNumber: req.params.dayNumber, userId: req.user.id },
    include: { model: Problem, include: Approach },
  });
  if (!day) return res.status(404).json({ success: false, message: "Day not found" });
  res.json({ success: true, data: day });
});

export const listDays = asyncHandler(async (req, res) => {
  const days = await Day.findAll({
    where: { userId: req.user.id },
    order: [["dayNumber", "DESC"]],
    include: { model: Problem, include: Approach },
  });
  res.json({ success: true, data: days });
});

export const deleteDay = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const day = await Day.findOne({ where: { id, userId: req.user.id } });
  if (!day) return res.status(404).json({ success: false, message: "Day not found" });
  await day.destroy();
  res.json({ success: true, message: "Day deleted" });
});

