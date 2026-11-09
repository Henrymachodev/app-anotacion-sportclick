-- =============================================================================
-- SPORT CLICK STATS - ESQUEMA DE BASE DE DATOS EN SUPABASE (POSTGRESQL)
-- =============================================================================
-- Instrucciones:
-- 1. Ve a tu proyecto en https://supabase.com
-- 2. Entra en "SQL Editor" en el menú lateral izquierdo.
-- 3. Pega este script completo y haz clic en "Run".
-- =============================================================================

-- 1. Tabla de Partidos (Games)
CREATE TABLE IF NOT EXISTS public.games (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  league_name TEXT,
  venue TEXT,
  game_date TEXT,
  visitor_name TEXT,
  home_name TEXT,
  visitor_score INT DEFAULT 0,
  home_score INT DEFAULT 0,
  inning INT DEFAULT 1,
  is_top_inning BOOLEAN DEFAULT TRUE,
  status TEXT DEFAULT 'En progreso', -- 'En progreso' | 'Finalizado'
  game_state JSONB NOT NULL,          -- Todo el estado (bases, lanzadores, bateadores, playLog)
  user_id TEXT
);

-- 2. Tabla de Checkpoints (Puntos de Control)
CREATE TABLE IF NOT EXISTS public.checkpoints (
  id TEXT PRIMARY KEY,
  game_id TEXT REFERENCES public.games(id) ON DELETE CASCADE,
  timestamp TEXT NOT NULL,
  inning_label TEXT NOT NULL,
  score_text TEXT NOT NULL,
  outs INT DEFAULT 0,
  note TEXT,
  state_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de Perfiles y Métricas de Anotadores
CREATE TABLE IF NOT EXISTS public.scorer_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  license TEXT,
  role TEXT DEFAULT 'Anotador Oficial',
  games_scored INT DEFAULT 0,
  innings_logged INT DEFAULT 0,
  plays_processed INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security - RLS)
-- Permite lectura y escritura pública mediante la clave pública (Anon Key)
-- =============================================================================

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorer_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para 'games'
CREATE POLICY "Permitir lectura pública de partidos" 
  ON public.games FOR SELECT USING (true);

CREATE POLICY "Permitir inserción y actualización de partidos" 
  ON public.games FOR ALL USING (true) WITH CHECK (true);

-- Políticas para 'checkpoints'
CREATE POLICY "Permitir lectura de checkpoints" 
  ON public.checkpoints FOR SELECT USING (true);

CREATE POLICY "Permitir inserción y gestión de checkpoints" 
  ON public.checkpoints FOR ALL USING (true) WITH CHECK (true);

-- Políticas para 'scorer_profiles'
CREATE POLICY "Permitir lectura de perfiles" 
  ON public.scorer_profiles FOR SELECT USING (true);

CREATE POLICY "Permitir gestión de perfiles" 
  ON public.scorer_profiles FOR ALL USING (true) WITH CHECK (true);

-- Índices de alto rendimiento
CREATE INDEX IF NOT EXISTS idx_games_updated_at ON public.games(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkpoints_game_id ON public.checkpoints(game_id);
