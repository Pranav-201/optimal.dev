CREATE DATABASE IF NOT EXISTS neetcode_tracker;
USE neetcode_tracker;
-- Tables auto-created by Sequelize sync on server start.
-- This file is a reference only; run `npm start` once and it builds these:
-- days(id, dayNumber, date, notes, createdAt, updatedAt)
-- problems(id, dayId, title, url, difficulty, pattern, timerSeconds, timerStartedAt, timerStoppedAt, createdAt, updatedAt)
-- approaches(id, problemId, type[brute|better|optimal], code, language, timeComplexity, spaceComplexity, notes, createdAt, updatedAt)
-- summaries(id, type[daily|weekly|monthly], refKey, content, createdAt, updatedAt)
