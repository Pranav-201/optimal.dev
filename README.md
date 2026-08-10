# NeetCode Tracker Backend

## Setup
```
npm install
cp .env.example .env   # fill DB + GROQ_API_KEY
npm start
```
Server syncs MySQL tables automatically on boot (needs an empty DB `neetcode_tracker` created beforehand).

## API

### Days
- `POST /api/days` `{ dayNumber, date?, notes? }`
- `GET /api/days`
- `GET /api/days/:dayNumber` (with problems + approaches)

### Problems
- `POST /api/problems` `{ dayNumber, title, url?, difficulty?, pattern? }`
- `GET /api/problems/:id`
- `PUT /api/problems/:id`
- `DELETE /api/problems/:id`
- `POST /api/problems/:id/timer/start`
- `POST /api/problems/:id/timer/stop`

### Approaches
- `POST /api/approaches` `{ problemId, type: brute|better|optimal, code, language?, timeComplexity?, spaceComplexity?, notes? }` (upserts per problem+type)
- `PUT /api/approaches/:id`
- `DELETE /api/approaches/:id`

### Summaries (LangGraph + Groq agent)
- `POST /api/summaries/daily` `{ dayNumber }`
- `POST /api/summaries/weekly` `{ fromDay, toDay }`
- `POST /api/summaries/monthly` `{ fromDay, toDay }`
- `GET /api/summaries?type=daily|weekly|monthly`

Flow: fetchData node pulls days/problems/approaches by day range -> generateSummary node calls Groq -> saved in `summaries` table.
