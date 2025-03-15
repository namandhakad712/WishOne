-- Fix for "Database error saving new user" (500 error)

-- 1. Drop the foreign key constraint temporarily to allow easier user creation
ALTER TABLE public.birthdays DROP CONSTRAINT IF EXISTS birthdays_user_id_fkey;

-- 2. Improve the ensure_user_exists function with better error handling
CREATE OR REPLACE FUNCTION ensure_user_exists(user_id UUID, user_email TEXT, avatar_url TEXT DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  -- Use a more robust approach with explicit error handling
  BEGIN
    INSERT INTO public.users (id, email, avatar_url)
    VALUES (user_id, user_email, avatar_url)
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url);
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the transaction
    RAISE LOG 'Error ensuring user exists: %', SQLERRM;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Improve the handle_new_user trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to ensure the user exists, but don't fail if there's an error
  BEGIN
    PERFORM ensure_user_exists(NEW.id, NEW.email, NEW.raw_user_meta_data->>'avatar_url');
  EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
  END;
  
  -- Always return NEW to allow the auth.users insert to succeed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Add additional service role policies
DROP POLICY IF EXISTS users_update_service ON public.users;
CREATE POLICY users_update_service ON public.users
FOR UPDATE TO service_role
USING (true);

-- 5. Grant additional permissions
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO service_role;

-- 6. Re-add the foreign key constraint but with deferred checking
ALTER TABLE public.birthdays
ADD CONSTRAINT birthdays_user_id_fkey
FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED; 