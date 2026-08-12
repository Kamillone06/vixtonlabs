-- ============================================================
-- Vixton Labs — Supabase schema
-- Paste this whole file into: Supabase project -> SQL Editor -> New query -> Run
-- ============================================================

-- ---------- SERVICES ("What We Do" cards) ----------
create table if not exists services (
  id          bigint generated always as identity primary key,
  title       text not null,
  description text not null,
  tags        text[] default '{}',
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ---------- WORKS ("Our Work" project cards) ----------
create table if not exists works (
  id          bigint generated always as identity primary key,
  title       text not null,
  category    text,
  description text not null,
  image_url   text,
  sort_order  int default 0,
  created_at  timestamptz default now()
);

-- ---------- MESSAGES (contact form submissions) ----------
create table if not exists messages (
  id          bigint generated always as identity primary key,
  name        text not null,
  email       text not null,
  service     text,
  message     text not null,
  created_at  timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- Public visitors (anon key) can only READ services/works and
-- INSERT into messages. Only a signed-in admin user (authenticated)
-- can add, edit, or delete anything.
-- ============================================================

alter table services enable row level security;
alter table works    enable row level security;
alter table messages enable row level security;

-- services: anyone can read, only logged-in admin can write
create policy "public can read services" on services
  for select using (true);
create policy "admin can insert services" on services
  for insert to authenticated with check (true);
create policy "admin can update services" on services
  for update to authenticated using (true);
create policy "admin can delete services" on services
  for delete to authenticated using (true);

-- works: anyone can read, only logged-in admin can write
create policy "public can read works" on works
  for select using (true);
create policy "admin can insert works" on works
  for insert to authenticated with check (true);
create policy "admin can update works" on works
  for update to authenticated using (true);
create policy "admin can delete works" on works
  for delete to authenticated using (true);

-- messages: anyone can submit (insert), only logged-in admin can read/delete
create policy "public can insert messages" on messages
  for insert to anon, authenticated with check (true);
create policy "admin can read messages" on messages
  for select to authenticated using (true);
create policy "admin can delete messages" on messages
  for delete to authenticated using (true);

-- ============================================================
-- Starter rows so the site isn't empty on first load.
-- Feel free to edit/delete these from the admin panel later.
-- ============================================================
insert into services (title, description, tags, sort_order) values
  ('Business Automation', 'Custom workflows that connect your tools and cut out repetitive manual work.', '{"Zapier/Make","APIs","Internal tools"}', 1),
  ('AI Chatbots', 'Conversational assistants trained on your business, wired into your site or WhatsApp.', '{"AI","NLP","Support"}', 2),
  ('Websites', 'Fast, modern, responsive websites built around what your business actually needs.', '{"React","SEO","Hosting"}', 3),
  ('Apps', 'Mobile and web apps from first sketch to app-store-ready product.', '{"iOS","Android","Web"}', 4),
  ('Student Projects', 'Final-year and academic projects, built properly and explained clearly.', '{"Guidance","Code","Docs"}', 5);
