# Development setup

This file outlines the minimal steps to get the project running locally.

## Prerequisites
- Go 1.20+
- Node 18+
- npm or pnpm
- Docker (optional, for local Postgres)
- Supabase account (or run locally with Supabase CLI)

## Supabase
1. Create a Supabase project and database.
2. From the project dashboard, get the `SUPABASE_URL` and `SUPABASE_KEY` (service role key for server).
3. Create a storage bucket named `dorm-images`.
4. Run the SQL migrations from `supabase/migrations/` with the Supabase CLI, or paste them into the SQL editor. The backend `migrations/` folder is kept for reference.

## Backend
- Copy `.env.example` to `.env` and fill values.
- From `backend/`:

```bash
# run server
go run ./cmd
```

## Frontend
We recommend creating the frontend with Vite (React + TypeScript):

```bash
# from repository root
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

## Notes
- The backend includes a simple Supabase storage helper at `backend/pkg/supabase/storage.go` — replace the stubbed upload implementation with the official Supabase client when ready.
- See `master.md` for high-level page list and features to implement.
