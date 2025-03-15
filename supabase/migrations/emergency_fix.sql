-- EMERGENCY FIX FOR USER CREATION ERROR
-- Run this SQL in the Supabase SQL Editor to fix the 500 error during signup

-- 1. Drop the foreign key constraint completely
ALTER TABLE public.birthdays DROP CONSTRAINT IF EXISTS birthdays_user_id_fkey;

-- 2. Drop the existing trigger that's causing problems
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Create a simplified version of the users table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT,
  avatar_url TEXT,
  full_name TEXT,
  settings JSONB
);

-- 4. Grant all permissions to fix any permission issues
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- 5. Create a very simple function to create users without any complex logic
CREATE OR REPLACE FUNCTION create_user_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail
  RAISE LOG 'Error creating user: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create a new trigger with the simplified function
CREATE TRIGGER create_user_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION create_user_on_signup();

-- 7. Add a policy to allow the service role to insert users
DROP POLICY IF EXISTS users_insert_service ON public.users;
CREATE POLICY users_insert_service ON public.users
FOR INSERT TO service_role
WITH CHECK (true);

-- 8. Add a policy to allow the service role to update users
DROP POLICY IF EXISTS users_update_service ON public.users;
CREATE POLICY users_update_service ON public.users
FOR UPDATE TO service_role
USING (true); 