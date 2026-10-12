# Equipment Maintenance Tracker - Frontend

Vue 3 (Single File Components) + Vite frontend. It talks to the Express backend.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173. The backend must be running on http://localhost:3000
(see the backend repo README).

## Project structure

```
src/
  main.js                          app entry
  App.vue                          page state, filters, create/update/delete handlers
  api.js                           fetch wrapper for the backend endpoints
  components/StatsBar.vue          summary numbers (total, scheduled, in progress, completed, overdue)
  components/MaintenanceForm.vue   add / edit form
  components/MaintenanceList.vue   records with Mark done, Edit and Delete buttons
  style.css                        styles
```
