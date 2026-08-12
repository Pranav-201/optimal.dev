import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { syncDb } from "./models/index.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await syncDb();
    console.log("DB connected & synced");
    app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
