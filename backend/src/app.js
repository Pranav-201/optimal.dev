import express from "express";
import cors from "cors";
import morgan from "morgan";
import dayRoutes from "./routes/dayRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import approachRoutes from "./routes/approachRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ success: true, message: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/days", requireAuth, dayRoutes);
app.use("/api/problems", requireAuth, problemRoutes);
app.use("/api/approaches", requireAuth, approachRoutes);
app.use("/api/summaries", requireAuth, summaryRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
