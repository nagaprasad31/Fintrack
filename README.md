# Smart Expense Tracker

A lightweight React + Vite app for tracking personal expenses, budgets, and reports.

## Overview

- Built with React (Vite) and React Router. Uses Context for state and Tailwind for styles.
- Includes pages for authentication, dashboard, adding expenses, and reports.

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (optional) to point to an API server:

```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the dev server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — build production bundle
- `npm run preview` — preview production build
- `npm run lint` — run ESLint

## Project Structure

```
src/
   App.jsx
   main.jsx
   index.css
   components/
      Navbar.jsx
      ExpenseCard.jsx
      Chart.jsx
      EditExpenseModal.jsx
      ProtectedRoute.jsx
   pages/
      Home.jsx
      Login.jsx
      Register.jsx
      Dashboard.jsx
      AddExpense.jsx
      Reports.jsx
   context/
      ExpenseContext.jsx
   hooks/
      useAuth.js
   services/
      api.js
      authService.js
   utils/
      helpers.js
```

## Notes

- Data is persisted to `localStorage` by default (token, user, expenses, categories).
- If you integrate a backend, set `VITE_API_URL` to your API endpoint.

## Troubleshooting

- If the app fails to start, run `npm install` then `npm run dev`.
- Check the browser console for runtime errors and ensure dependencies (like Recharts) are installed.

