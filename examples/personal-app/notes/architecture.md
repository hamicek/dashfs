# Architecture Notes

## Tech Stack
- **Frontend:** Next.js 14 with App Router
- **Database:** PostgreSQL on Supabase
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS

## Database Schema

```
User
  - id
  - email
  - name
  - createdAt

Habit
  - id
  - userId
  - name
  - frequency (daily/weekly)
  - color
  - createdAt

Entry
  - id
  - habitId
  - date
  - completed
```

## API Routes

- `GET /api/habits` - List user habits
- `POST /api/habits` - Create habit
- `POST /api/habits/:id/complete` - Mark completed
- `GET /api/stats` - Get statistics
