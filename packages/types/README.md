# @veil/types

Shared types, generated database types, and the **API contract** for Veil.

## What lives here

- `src/index.ts` — hand-written shared TypeScript types and zod schemas (zod arrives with the UI kit ticket).
- `src/supabase.ts` — **generated** Supabase database types via `supabase gen types`. Never edit by hand.
- This README — the API contract: the inventory of tables, RPC functions, and Edge Functions. Every backend change updates this file.

## API contract (updated as backend grows)

### Tables
_None yet — added from Phase 1 (profiles, questions_bank)._

### RPC functions
_None yet._

### Edge Functions
_None yet._

### Conventions
- Row Level Security on every table; clients never bypass it.
- State transitions happen only through RPC functions — clients never write state columns directly.
- Photos and other media live in private storage buckets; signed URLs are issued only via server-side functions.
