# Worker Context — La Loge CRM v2

## Project Path
`/Users/ludovicgoutel/CRM loge/laloge-crm-v2/`

## Stack
- Next.js 16 + React 19 + Tailwind v4 + ShadCN UI + TanStack
- Supabase (project: `lhimlzvslcvdcdqmaadg`)
- npm (NOT pnpm)
- TypeScript strict-ish (ignoreBuildErrors in next.config)

## Build Command
`npm run build` — runs `scripts/build.mjs` (symlink to avoid spaces in path, then typegen + tsc + next build --webpack)

## Supabase
- URL: `https://lhimlzvslcvdcdqmaadg.supabase.co`
- Anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoaW1senZzbGN2ZGNkcW1hYWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NDE5MTksImV4cCI6MjA4ODAxNzkxOX0.FlfXMH1KLdJB6jVLFf0VYObaDje92Zm5x9xkbX3YuwM`
- Service role key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoaW1senZzbGN2ZGNkcW1hYWRnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjQ0MTkxOSwiZXhwIjoyMDg4MDE3OTE5fQ.LtJNv8Nr3yTJZfiIUscQe7OlcWEz5BD_r3b2YC4zu3g`
- Client utils exist: `lib/supabase/client.ts` + `lib/supabase/server.ts`
- .env.local has NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY

## Key Tables
- `salons` (1,707 rows) — id, name, address, city, postal_code, phone, email, website, status, score, team_size, enrichment_status, google_rating, review_count, brands_used, specialties, latitude, longitude, assigned_to, notes, siret, naf_code, franchise, franchise_name, created_at, updated_at, etc.
- `brands` (6 rows) — id, name, logo_url, category, status, metadata (JSONB with criteria), created_at
- `contacts` — id, salon_id, first_name, last_name, email, phone, role, is_primary, created_at
- `agent_actions` — id, agent_name, action_type, salon_id, brand_id, status, priority, description, result, metadata, created_at
- `approvals` — id, agent_action_id, status, approved_by, comment, created_at
- `activity_log` — id, entity_type, entity_id, action, actor, details, created_at
- `outreach` — id, salon_id, type, status, subject, body, sent_at, opened_at, replied_at, created_at
- `outreach_sequences` — id, name, description, steps (JSONB), status, created_at
- `campaigns` — id, name, brand_id, type, status, target_count, sent_count, open_rate, created_at
- `brand_salon_scores` — id, brand_id, salon_id, score, breakdown (JSONB), created_at
- `pipeline_history` — id, salon_id, from_status, to_status, changed_by, created_at
- `profiles` — id, email, full_name, role, avatar_url, created_at
- `client_dossiers` — id, salon_id, brand_id, status, content, generated_at, created_at

## DB Column Convention
- English snake_case in DB
- French labels in UI
- Status values: nouveau, contacte, interesse, rdv_planifie, negociation, gagne, perdu, client_actif (no accents)

## Route Structure
- `app/dashboard/(auth)/` — protected pages with sidebar layout
- `app/dashboard/(guest)/` — public pages (login, register, forgot-password)
- `app/(auth)/` — OLD template routes (some re-export placeholders — DO NOT USE)

## Pages Status
✅ Done: dashboard, crm, salons (list+detail), brands (list+detail), contacts, pipeline, agents, reports, settings (7 sub-pages)
❌ Placeholder: actions, outreach (components exist but page re-exports placeholder), dossiers

## La Loge Branding
- Gold: `#C5A572` / CSS var: `--brand-gold`
- Navy: `#0A1628`
- Cream: `#F5F0EB`
- Fonts: Playfair Display (display) + Inter (body)
- Commerciales: Bonnie, Marie-Pierre

## IMPORTANT
- ALL UI text in French
- ALL code/variables in English
- Test builds with `npm run build` before declaring done
- Do NOT modify files outside your assigned scope
- Do NOT commit to git (manager handles that)
