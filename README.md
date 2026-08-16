# InspectFlow

InspectFlow is a B2B SaaS inspection and corrective-action platform: schedule inspections, run checklists, track failed items as findings, assign corrective actions, and generate reports — all backed by a real multi-tenant Postgres database with Row Level Security.

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS · Supabase (Auth, Postgres, RLS, Storage) · React Hook Form · Zod · Recharts

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - In the SQL Editor, run the migrations in `supabase/migrations/` **in order**: `0001_init.sql`, then `0002_storage.sql`.
   - Copy `.env.example` to `.env.local` and fill in your Project URL, anon key, and (optionally) service role key from Project Settings → API.

3. **Run the app**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example`. At minimum you need `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Everything else (AI assistant, payment links, service role key) is optional — the app degrades gracefully ("Coming soon" / sign-up fallback) when they're unset.

## Project structure

- `src/app` — routes: marketing site, `(auth)` pages, `onboarding`, `dashboard/*`, API routes
- `src/components` — UI primitives, marketing sections, and feature components grouped by domain
- `src/lib` — Supabase clients (browser/server/admin/middleware), Zod validation schemas, small utilities
- `src/types/database.ts` — hand-written types matching the SQL schema (regenerate with the Supabase CLI once linked)
- `supabase/migrations` — SQL schema, RLS policies, and storage bucket setup

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run lint      # ESLint
npx tsc --noEmit  # type-check
```

## Deploying

Deploy to Vercel and connect the same environment variables from `.env.local`. See the project owner's deployment notes for connecting the `inspectflow.click` domain.
