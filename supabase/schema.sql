-- Quantum Core · Trading Command Center
-- Run this once in Supabase → SQL Editor.
-- Every record the app stores is a JSON document owned by the signed-in user.

create table if not exists public.documents (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  collection text        not null,
  doc_id     text        not null,
  data       jsonb       not null default '{}'::jsonb,
  deleted    boolean     not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, collection, doc_id)
);

create index if not exists documents_user_updated_idx
  on public.documents (user_id, updated_at);

alter table public.documents enable row level security;

drop policy if exists "documents are private to their owner" on public.documents;
create policy "documents are private to their owner"
  on public.documents
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
