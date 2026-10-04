# HabitTrack – Personal Habit Tracking Website (MERN)

Register, log in, create habits, mark them complete each day, edit/delete them and view progress.

## Requirements
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

### 1. Backend
```
cd server
npm install
npm run dev
```
A default `server/.env` is included (local MongoDB, port 5000). Change `MONGO_URI` if you use Atlas.
Server runs at http://localhost:5000

### 2. Frontend (new terminal)
```
cd client
npm install
npm run dev
```
Open http://localhost:5173

## API routes
| Method | Route | Purpose |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login (returns JWT) |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Current user (Profile) |
| GET | /api/habits | Get user's habits |
| POST | /api/habits | Add habit |
| PUT | /api/habits/:id | Edit habit |
| PUT | /api/habits/:id/complete | Toggle today's completion |
| DELETE | /api/habits/:id | Delete habit |

## Demo order
Register → Login → GET (My Habits) → POST (Add) → PUT (Edit) → Complete → DELETE → Progress → Logout

## Sample data
With MongoDB running, from the `server` folder:
```
npm run seed
```
This creates a demo account (**demo@habittrack.com / demo123**) with 6 habits and 5 weeks of history.
You can also click **Add sample habits** on the dashboard when an account has no habits.

## Frequency and calendar
- Each habit can repeat **Daily, Every 2 days, Every 3 days or Weekly**. Habits that are not due yet show "Next due in N days" and are not counted against today's progress.
- Streaks count check-ins in a row, allowing the habit's interval between them.
- The **Calendar** page shows a monthly view of your progress. Filter by habit, click a day to see details, and mark or undo check-ins for today or past days.
- Run `npm run seed` again to refresh the demo account with the new frequencies.
