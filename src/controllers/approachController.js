import { Problem, Approach } from "../models/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addApproach = asyncHandler(async (req, res) => {
  const { problemId, type, code, language, timeComplexity, spaceComplexity, notes } = req.body;
  const problem = await Problem.findByPk(problemId);
  if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

  const [approach, created] = await Approach.findOrCreate({
    where: { problemId, type },
    defaults: { code, language, timeComplexity, spaceComplexity, notes },
  });

  if (!created) {
    await approach.update({ code, language, timeComplexity, spaceComplexity, notes });
  }

  res.status(201).json({ success: true, data: approach });
});

export const updateApproach = asyncHandler(async (req, res) => {
  const approach = await Approach.findByPk(req.params.id);
  if (!approach) return res.status(404).json({ success: false, message: "Approach not found" });
  await approach.update(req.body);
  res.json({ success: true, data: approach });
});

export const deleteApproach = asyncHandler(async (req, res) => {
  const approach = await Approach.findByPk(req.params.id);
  if (!approach) return res.status(404).json({ success: false, message: "Approach not found" });
  await approach.destroy();
  res.json({ success: true, message: "Deleted" });
});
