import { Day, Problem, Approach } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addProblem = asyncHandler(async (req, res) => {
  const { dayNumber, title, url, difficulty, pattern } = req.body;
  const [day] = await Day.findOrCreate({ where: { dayNumber }, defaults: { date: new Date() } });
  const problem = await Problem.create({ dayId: day.id, title, url, difficulty, pattern });
  res.status(201).json({ success: true, data: problem });
});

export const getProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByPk(req.params.id, { include: Approach });
  if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });
  res.json({ success: true, data: problem });
});

export const updateProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByPk(req.params.id);
  if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });
  await problem.update(req.body);
  res.json({ success: true, data: problem });
});

export const deleteProblem = asyncHandler(async (req, res) => {
  const problem = await Problem.findByPk(req.params.id);
  if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });
  await problem.destroy();
  res.json({ success: true, message: "Deleted" });
});
