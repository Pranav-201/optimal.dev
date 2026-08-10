<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=220&section=header&text=NeetCode%20Tracker&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Track.%20Solve.%20Summarize%20with%20AI.&descAlignY=58&descSize=18" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=2500&pause=800&color=6C63FF&center=true&vCenter=true&width=650&lines=%F0%9F%93%9A+Log+every+NeetCode+grind+session;%E2%9C%8D%EF%B8%8F+Store+brute+%E2%86%92+better+%E2%86%92+optimal+approaches;%E2%8F%B1%EF%B8%8F+Time+yourself+per+problem;%F0%9F%A4%96+Get+AI-generated+daily%2Fweekly%2Fmonthly+recaps" alt="Typing SVG" />

<br/>

<img src="https://img.shields.io/badge/Node.js-Backend-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white"/>
<img src="https://img.shields.io/badge/LangGraph-Agent-1C1C1C?style=for-the-badge&logo=langchain&logoColor=white"/>
<img src="https://img.shields.io/badge/Groq-LLM-F55036?style=for-the-badge&logo=groq&logoColor=white"/>
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge"/>

<br/><br/>

<img src="https://raw.githubusercontent.com/Anmol-Baranwal/Cool-GIFs-For-GitHub/main/images/three_dots_1.gif" width="100"/>

</div>

<br/>

## 📖 About

**NeetCode Tracker** is a backend that turns your daily DSA practice into structured, queryable data — then uses an **LLM agent (LangGraph + Groq)** to generate reflective summaries of your progress, so you can actually see how you're improving instead of just guessing.

<div align="center">
<img src="https://user-images.githubusercontent.com/74038190/213866269-5d00981c-7c98-46d7-8a8e-16f462f15227.gif" width="500">
</div>

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 📅 Day Tracking
Log a practice day with a number, date, and freeform notes. Every problem you solve that day is linked back to it.

### 🧩 Problem Management
Full CRUD for problems — title, URL, difficulty, and pattern (e.g. `sliding-window`, `two-pointers`).

</td>
<td width="50%" valign="top">

### ⏱️ Built-in Timer
Start/stop a timer per problem to track exactly how long each attempt takes you.

### 🧠 Multi-Approach Storage
Save your **brute force → better → optimal** journey per problem, each with its own code, complexity, and notes.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🤖 AI Summaries
A LangGraph agent pulls your day/problem/approach data and asks Groq to generate daily, weekly, or monthly recaps.

</td>
<td width="50%" valign="top">

### 🗄️ Auto-Synced Schema
MySQL tables sync automatically on boot via Sequelize/ORM — no manual migrations needed to get started.

</td>
</tr>
</table>

---

## 🏗️ How It Works

```mermaid
flowchart LR
    A[📅 Log a Day] --> B[🧩 Add Problems]
    B --> C[⏱️ Start/Stop Timer]
    B --> D[🧠 Save Approaches<br/>brute · better · optimal]
    C --> E[(🗄️ MySQL)]
    D --> E
    E --> F{Summary Requested}
    F -->|daily/weekly/monthly| G[fetchData node<br/>pulls day range]
    G --> H[generateSummary node<br/>Groq LLM call]
    H --> I[💾 Saved to summaries table]
    I --> J[📊 GET /api/summaries]

    style A fill:#6C63FF,color:#fff
    style E fill:#4479A1,color:#fff
    style H fill:#F55036,color:#fff
    style J fill:#1C1C1C,color:#fff
```

---

## 🚀 Quick Start

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="35"> **1. Install dependencies**

```bash
npm install
```

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="35"> **2. Configure environment**

```bash
cp .env.example .env
# fill in your DB credentials + GROQ_API_KEY
```

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="35"> **3. Create an empty database**

```sql
CREATE DATABASE neetcode_tracker;
```

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="35"> **4. Run it**

```bash
npm start
```

> Tables sync automatically on boot — no manual migrations required. ✅

---

## 📡 API Reference

### 📅 Days

| Method | Endpoint | Body | Description |
|--------|----------|------|--------------|
| `POST` | `/api/days` | `{ dayNumber, date?, notes? }` | Create a new day |
| `GET` | `/api/days` | — | List all days |
| `GET` | `/api/days/:dayNumber` | — | Get a day with its problems + approaches |

### 🧩 Problems

| Method | Endpoint | Body | Description |
|--------|----------|------|--------------|
| `POST` | `/api/problems` | `{ dayNumber, title, url?, difficulty?, pattern? }` | Add a problem |
| `GET` | `/api/problems/:id` | — | Get a problem |
| `PUT` | `/api/problems/:id` | — | Update a problem |
| `DELETE` | `/api/problems/:id` | — | Delete a problem |
| `POST` | `/api/problems/:id/timer/start` | — | Start the solve timer |
| `POST` | `/api/problems/:id/timer/stop` | — | Stop the solve timer |

### 🧠 Approaches

| Method | Endpoint | Body | Description |
|--------|----------|------|--------------|
| `POST` | `/api/approaches` | `{ problemId, type: brute\|better\|optimal, code, language?, timeComplexity?, spaceComplexity?, notes? }` | Upsert an approach per problem + type |
| `PUT` | `/api/approaches/:id` | — | Update an approach |
| `DELETE` | `/api/approaches/:id` | — | Delete an approach |

### 🤖 Summaries <sub><i>(LangGraph + Groq agent)</i></sub>

| Method | Endpoint | Body | Description |
|--------|----------|------|--------------|
| `POST` | `/api/summaries/daily` | `{ dayNumber }` | Generate a daily summary |
| `POST` | `/api/summaries/weekly` | `{ fromDay, toDay }` | Generate a weekly summary |
| `POST` | `/api/summaries/monthly` | `{ fromDay, toDay }` | Generate a monthly summary |
| `GET` | `/api/summaries?type=daily\|weekly\|monthly` | — | Fetch saved summaries |

**Summary flow:** `fetchData` node pulls days/problems/approaches for the requested range → `generateSummary` node calls Groq → result is saved to the `summaries` table.

---

## 🗂️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,express,mysql,js" />

</div>

---

## 🛣️ Roadmap

- [ ] Auth + multi-user support
- [ ] Streak tracking & heatmap endpoint
- [ ] Export summaries as PDF/Markdown
- [ ] Pattern-based analytics (weakest patterns, avg time by difficulty)
- [ ] Webhook/Slack digest for weekly summaries

---

<div align="center">

### ⭐ If this helped organize your grind, consider starring the repo

<img src="https://raw.githubusercontent.com/Anmol-Baranwal/Cool-GIFs-For-GitHub/main/images/three_dots_1.gif" width="100"/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer" width="100%"/>

</div>
