-- Init Supabase schema for loja
-- Cria tabelas: clientes, pedidos, itens_pedido

-- Habilita extensão para gen_random_uuid se necessário
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text,
  telefone text,
  endereco jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pedidos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  total numeric(10,2) NOT NULL,
  status text DEFAULT 'pendente',
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.itens_pedido (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id uuid NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  product_id bigint,
  name text,
  quantity integer NOT NULL,
  unit_price numeric(10,2),
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS (os inserts pelas service role não são afetados)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;

-- Políticas mínimas para admins (role 'admin') lerem tudo
CREATE POLICY IF NOT EXISTS admin_select_all_clientes ON public.clientes
  FOR SELECT USING ( auth.role() = 'admin' );

CREATE POLICY IF NOT EXISTS admin_select_all_pedidos ON public.pedidos
  FOR SELECT USING ( auth.role() = 'admin' );

CREATE POLICY IF NOT EXISTS admin_select_all_itens ON public.itens_pedido
  FOR SELECT USING ( auth.role() = 'admin' );

-- Permitir inserção (no exemplo, permissivo: ajuste para seu uso em produção)
CREATE POLICY IF NOT EXISTS allow_insert_clientes ON public.clientes
  FOR INSERT USING ( true ) WITH CHECK ( true );

CREATE POLICY IF NOT EXISTS allow_insert_pedidos ON public.pedidos
  FOR INSERT USING ( true ) WITH CHECK ( true );

CREATE POLICY IF NOT EXISTS allow_insert_itens ON public.itens_pedido
  FOR INSERT USING ( true ) WITH CHECK ( true );
