import { StateGraph, END, START, Annotation } from "@langchain/langgraph";
import { Day, Problem, Approach } from "../models/index.js";
import { askGroq } from "../services/groqClient.js";
import { Op } from "sequelize";

const State = Annotation.Root({
  type: Annotation(),
  fromDay: Annotation(),
  toDay: Annotation(),
  data: Annotation(),
  summary: Annotation(),
});

const fetchData = async (state) => {
  const days = await Day.findAll({
    where: { dayNumber: { [Op.between]: [state.fromDay, state.toDay] } },
    include: { model: Problem, include: Approach },
    order: [["dayNumber", "ASC"]],
  });

  const data = days.map((d) => ({
    dayNumber: d.dayNumber,
    date: d.date,
    problems: d.Problems.map((p) => ({
      title: p.title,
      difficulty: p.difficulty,
      pattern: p.pattern,
      timerSeconds: p.timerSeconds,
      approaches: p.Approaches.map((a) => ({
        type: a.type,
        timeComplexity: a.timeComplexity,
        spaceComplexity: a.spaceComplexity,
        notes: a.notes,
      })),
    })),
  }));

  return { data };
};

const generateSummary = async (state) => {
  const systemPrompt =
    "You are a DSA revision assistant. Given a JSON log of solved problems (with patterns, difficulty, approaches, complexities, and timings), write a concise revision summary. Group by pattern, call out weak areas (problems that took long or only had brute force), list complexity trends, and end with 3-5 problems worth revisiting first. Keep it tight, no fluff.";

  const userPrompt = `Type: ${state.type}\nDay range: ${state.fromDay}-${state.toDay}\nData:\n${JSON.stringify(state.data)}`;

  const summary = await askGroq(systemPrompt, userPrompt);
  return { summary };
};

const graph = new StateGraph(State)
  .addNode("fetchData", fetchData)
  .addNode("generateSummary", generateSummary)
  .addEdge(START, "fetchData")
  .addEdge("fetchData", "generateSummary")
  .addEdge("generateSummary", END);

export const summaryAgent = graph.compile();
