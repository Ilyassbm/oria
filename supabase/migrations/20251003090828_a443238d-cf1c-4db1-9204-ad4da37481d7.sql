-- =====================================================
-- ORIA SAAS PLATFORM - PHASE 2: DATABASE SCHEMA
-- Multi-tenant architecture with secure RLS policies
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. AGENCIES TABLE (Multi-tenant root)
-- =====================================================
CREATE TABLE public.agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6726CC',
  secondary_color TEXT,
  stripe_customer_id TEXT,
  stripe_account_id TEXT,
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'trial')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on agencies
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. PROFILES TABLE (User profiles)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(id, agency_id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. USER ROLES TABLE (Security: separate from profiles)
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, agency_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. CLIENTS TABLE
-- =====================================================
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create index for better performance
CREATE INDEX idx_clients_agency_id ON public.clients(agency_id);
CREATE INDEX idx_clients_status ON public.clients(status);

-- =====================================================
-- 5. SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT DEFAULT 'EUR' NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'quarterly', 'annual')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'at_risk')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  next_billing_date DATE NOT NULL,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  auto_renew BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_subscriptions_agency_id ON public.subscriptions(agency_id);
CREATE INDEX idx_subscriptions_client_id ON public.subscriptions(client_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing_date ON public.subscriptions(next_billing_date);

-- =====================================================
-- 6. VALUE JOURNAL TABLE
-- =====================================================
CREATE TABLE public.value_journal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  value_amount DECIMAL(10, 2) CHECK (value_amount >= 0),
  value_type TEXT CHECK (value_type IN ('time_saved', 'revenue_generated', 'cost_reduced', 'other')),
  intervention_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on value_journal
ALTER TABLE public.value_journal ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_value_journal_agency_id ON public.value_journal(agency_id);
CREATE INDEX idx_value_journal_client_id ON public.value_journal(client_id);
CREATE INDEX idx_value_journal_subscription_id ON public.value_journal(subscription_id);
CREATE INDEX idx_value_journal_intervention_date ON public.value_journal(intervention_date);

-- =====================================================
-- SECURITY DEFINER FUNCTIONS (Avoid RLS recursion)
-- =====================================================

-- Function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Function to get user's agency_id
CREATE OR REPLACE FUNCTION public.get_user_agency_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT agency_id
  FROM public.profiles
  WHERE id = _user_id
  LIMIT 1;
$$;

-- Function to check if user belongs to agency
CREATE OR REPLACE FUNCTION public.user_belongs_to_agency(_user_id UUID, _agency_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND agency_id = _agency_id
  );
$$;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- AGENCIES POLICIES
CREATE POLICY "Users can view their own agency"
  ON public.agencies
  FOR SELECT
  TO authenticated
  USING (id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Admins can update their agency"
  ON public.agencies
  FOR UPDATE
  TO authenticated
  USING (
    id = public.get_user_agency_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- PROFILES POLICIES
CREATE POLICY "Users can view profiles in their agency"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- USER ROLES POLICIES
CREATE POLICY "Users can view roles in their agency"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Admins can manage roles in their agency"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (
    agency_id = public.get_user_agency_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- CLIENTS POLICIES
CREATE POLICY "Users can view clients in their agency"
  ON public.clients
  FOR SELECT
  TO authenticated
  USING (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Users can create clients in their agency"
  ON public.clients
  FOR INSERT
  TO authenticated
  WITH CHECK (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Users can update clients in their agency"
  ON public.clients
  FOR UPDATE
  TO authenticated
  USING (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Admins can delete clients in their agency"
  ON public.clients
  FOR DELETE
  TO authenticated
  USING (
    agency_id = public.get_user_agency_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view subscriptions in their agency"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Users can create subscriptions in their agency"
  ON public.subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Users can update subscriptions in their agency"
  ON public.subscriptions
  FOR UPDATE
  TO authenticated
  USING (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Admins can delete subscriptions in their agency"
  ON public.subscriptions
  FOR DELETE
  TO authenticated
  USING (
    agency_id = public.get_user_agency_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- VALUE JOURNAL POLICIES
CREATE POLICY "Users can view value journal in their agency"
  ON public.value_journal
  FOR SELECT
  TO authenticated
  USING (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Users can create value journal entries in their agency"
  ON public.value_journal
  FOR INSERT
  TO authenticated
  WITH CHECK (agency_id = public.get_user_agency_id(auth.uid()));

CREATE POLICY "Users can update their value journal entries"
  ON public.value_journal
  FOR UPDATE
  TO authenticated
  USING (
    agency_id = public.get_user_agency_id(auth.uid())
    AND created_by = auth.uid()
  );

CREATE POLICY "Admins can delete value journal entries in their agency"
  ON public.value_journal
  FOR DELETE
  TO authenticated
  USING (
    agency_id = public.get_user_agency_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_value_journal_updated_at
  BEFORE UPDATE ON public.value_journal
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- TRIGGER: Auto-create profile on user signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_agency_id UUID;
  user_email TEXT;
BEGIN
  -- Get email from metadata or auth
  user_email := COALESCE(
    NEW.raw_user_meta_data->>'email',
    NEW.email
  );

  -- Create a new agency for the first user (they become admin)
  INSERT INTO public.agencies (name)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'company_name', 'Mon Agence'))
  RETURNING id INTO new_agency_id;

  -- Create profile
  INSERT INTO public.profiles (id, agency_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    new_agency_id,
    user_email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );

  -- Assign admin role to first user
  INSERT INTO public.user_roles (user_id, agency_id, role)
  VALUES (NEW.id, new_agency_id, 'admin');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();