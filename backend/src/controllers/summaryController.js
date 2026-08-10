import { Summary } from "../models/index.js";
import { summaryAgent } from "../graph/summaryGraph.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const runAndSave = async (type, fromDay, toDay, userId) => {
  const result = await summaryAgent.invoke({ type, fromDay, toDay });
  const refKey = `${fromDay}-${toDay}`;
  const [summary] = await Summary.upsert(
    { type, refKey, content: result.summary, userId },
    { returning: true }
  );
  return summary || (await Summary.findOne({ where: { type, refKey, userId } }));
};

export const generateDailySummary = asyncHandler(async (req, res) => {
  const { dayNumber } = req.body;
  const summary = await runAndSave("daily", dayNumber, dayNumber, req.user.id);
  res.json({ success: true, data: summary });
});

export const generateWeeklySummary = asyncHandler(async (req, res) => {
  const { fromDay, toDay } = req.body;
  const summary = await runAndSave("weekly", fromDay, toDay, req.user.id);
  res.json({ success: true, data: summary });
});

export const generateMonthlySummary = asyncHandler(async (req, res) => {
  const { fromDay, toDay } = req.body;
  const summary = await runAndSave("monthly", fromDay, toDay, req.user.id);
  res.json({ success: true, data: summary });
});

export const listSummaries = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const where = type ? { type, userId: req.user.id } : { userId: req.user.id };
  const summaries = await Summary.findAll({ where, order: [["createdAt", "DESC"]] });
  res.json({ success: true, data: summaries });
});
