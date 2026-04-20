-- Ejecutar en Supabase Dashboard (proyecto ATBC, donde vive la credential 'Supabase ATBC')
-- SQL Editor → New query → pegar esto → Run

create table if not exists public.citas_motorperu_demo (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  telefono text not null,
  email text,
  modelo_interes text,
  sede text not null,
  fecha text not null,
  hora text not null,
  session_id text,
  ip text,
  origin text,
  estado text default 'agendada'
);

-- Habilitar RLS pero permitir INSERT al service_role (que usa n8n)
alter table public.citas_motorperu_demo enable row level security;

-- RLS policies (n8n usa service_role que bypasea RLS automáticamente, esto es solo por compliance)
create policy "insert_any" on public.citas_motorperu_demo
  for insert with check (true);

create policy "select_service_role" on public.citas_motorperu_demo
  for select using (auth.role() = 'service_role');

create index if not exists idx_citas_mp_created on public.citas_motorperu_demo(created_at desc);
create index if not exists idx_citas_mp_sede on public.citas_motorperu_demo(sede, fecha);
