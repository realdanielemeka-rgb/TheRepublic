-- The Republic Wix preservation layer. Public content is readable; only
-- trusted server or database administration can change it.

create table if not exists public.legacy_pages (
  slug text primary key,
  path text not null unique,
  source_url text not null,
  title text not null,
  meta jsonb not null default '{}'::jsonb,
  headings jsonb not null default '[]'::jsonb,
  body_text text not null,
  full_visible_text text not null,
  links jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  captured_at timestamptz not null default now()
);

create table if not exists public.legacy_assets (
  source_id text primary key,
  kind text not null check (kind in ('image', 'video')),
  display_name text not null,
  source_url text not null,
  bytes bigint,
  sha256 text,
  storage_path text,
  archived_at timestamptz not null default now()
);

alter table public.legacy_pages enable row level security;
alter table public.legacy_assets enable row level security;

revoke all on public.legacy_pages from anon, authenticated;
revoke all on public.legacy_assets from anon, authenticated;

grant select on public.legacy_pages to anon, authenticated;
grant select on public.legacy_assets to anon, authenticated;
grant select, insert, update, delete on public.legacy_pages to service_role;
grant select, insert, update, delete on public.legacy_assets to service_role;

create policy "Public can read archived pages"
on public.legacy_pages for select to anon, authenticated
using (true);

create policy "Public can read archived asset metadata"
on public.legacy_assets for select to anon, authenticated
using (true);
