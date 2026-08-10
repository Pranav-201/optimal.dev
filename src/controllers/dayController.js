import { Day, Problem, Approach } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createDay = asyncHandler(async (req, res) => {
  const { dayNumber, date, notes } = req.body;
  const [day, created] = await Day.findOrCreate({
    where: { dayNumber },
    defaults: { date: date || new Date(), notes },
  });
  res.status(created ? 201 : 200).json({ success: true, data: day });
});

export const getDay = asyncHandler(async (req, res) => {
  const day = await Day.findOne({
    where: { dayNumber: req.params.dayNumber },
    include: { model: Problem, include: Approach },
  });
  if (!day) return res.status(404).json({ success: false, message: "Day not found" });
  res.json({ success: true, data: day });
});

export const listDays = asyncHandler(async (req, res) => {
  const days = await Day.findAll({ order: [["dayNumber", "ASC"]] });
  res.json({ success: true, data: days });
});
