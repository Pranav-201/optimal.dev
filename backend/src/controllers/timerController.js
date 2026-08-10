import { Problem, Day } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const startTimer = asyncHandler(async (req, res) => {
  const problem = await Problem.findByPk(req.params.id, { include: Day });
  if (!problem || problem.Day.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: "Problem not found" });
  }
  await problem.update({ timerStartedAt: new Date(), timerStoppedAt: null, timerSeconds: null });
  res.json({ success: true, data: problem });
});

export const stopTimer = asyncHandler(async (req, res) => {
  const problem = await Problem.findByPk(req.params.id, { include: Day });
  if (!problem || problem.Day.userId !== req.user.id) {
    return res.status(404).json({ success: false, message: "Problem not found" });
  }
  if (!problem.timerStartedAt) return res.status(400).json({ success: false, message: "Timer not started" });

  const stoppedAt = new Date();
  const seconds = Math.round((stoppedAt - new Date(problem.timerStartedAt)) / 1000);
  await problem.update({ timerStoppedAt: stoppedAt, timerSeconds: seconds });
  res.json({ success: true, data: problem });
});
