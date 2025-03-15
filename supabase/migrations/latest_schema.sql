-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  settings JSONB
);

-- Create birthdays table
CREATE TABLE IF NOT EXISTS public.birthdays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  relation TEXT NOT NULL,
  reminder_days INTEGER NOT NULL DEFAULT 7,
  google_calendar_linked BOOLEAN DEFAULT FALSE,
  notes TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS birthdays_user_id_idx ON public.birthdays(user_id);
CREATE INDEX IF NOT EXISTS birthdays_date_idx ON public.birthdays(date);
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS birthdays_updated_at ON public.birthdays;
CREATE TRIGGER birthdays_updated_at
BEFORE UPDATE ON public.birthdays
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthdays ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
DROP POLICY IF EXISTS users_select_own ON public.users;
CREATE POLICY users_select_own ON public.users
FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS users_insert_own ON public.users;
CREATE POLICY users_insert_own ON public.users
FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
FOR UPDATE USING (auth.uid() = id);

-- Add policy to allow the service role to insert users (needed for signup)
DROP POLICY IF EXISTS users_insert_service ON public.users;
CREATE POLICY users_insert_service ON public.users
FOR INSERT TO service_role
WITH CHECK (true);

-- Create policies for birthdays table
DROP POLICY IF EXISTS birthdays_select_own ON public.birthdays;
CREATE POLICY birthdays_select_own ON public.birthdays
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS birthdays_insert_own ON public.birthdays;
CREATE POLICY birthdays_insert_own ON public.birthdays
FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS birthdays_update_own ON public.birthdays;
CREATE POLICY birthdays_update_own ON public.birthdays
FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS birthdays_delete_own ON public.birthdays;
CREATE POLICY birthdays_delete_own ON public.birthdays
FOR DELETE USING (auth.uid() = user_id);

-- Create a function to ensure a user exists in the public table
CREATE OR REPLACE FUNCTION ensure_user_exists(user_id UUID, user_email TEXT, avatar_url TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.users (id, email, avatar_url)
  VALUES (user_id, user_email, avatar_url)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error ensuring user exists: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to ensure users exist after signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM ensure_user_exists(NEW.id, NEW.email, NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to ensure users exist after signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Create a function to get upcoming birthdays for a user
CREATE OR REPLACE FUNCTION get_upcoming_birthdays(
  p_user_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS SETOF public.birthdays AS $$
DECLARE
  today DATE := CURRENT_DATE;
  end_date DATE := today + p_days;
BEGIN
  RETURN QUERY
  WITH birthdays_with_next_date AS (
    SELECT 
      b.*,
      CASE 
        -- If birthday this year has passed, use next year's date
        WHEN TO_DATE(EXTRACT(YEAR FROM today) || '-' || EXTRACT(MONTH FROM b.date) || '-' || EXTRACT(DAY FROM b.date), 'YYYY-MM-DD') < today
        THEN TO_DATE((EXTRACT(YEAR FROM today) + 1) || '-' || EXTRACT(MONTH FROM b.date) || '-' || EXTRACT(DAY FROM b.date), 'YYYY-MM-DD')
        -- Otherwise use this year's date
        ELSE TO_DATE(EXTRACT(YEAR FROM today) || '-' || EXTRACT(MONTH FROM b.date) || '-' || EXTRACT(DAY FROM b.date), 'YYYY-MM-DD')
      END AS next_birthday_date
    FROM public.birthdays b
    WHERE b.user_id = p_user_id
  )
  SELECT b.*
  FROM birthdays_with_next_date b
  WHERE b.next_birthday_date BETWEEN today AND end_date
  ORDER BY b.next_birthday_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role; 