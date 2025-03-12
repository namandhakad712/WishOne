-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS delete_auth_user_trigger ON public.users;
DROP FUNCTION IF EXISTS public.debug_auth_uid();
DROP FUNCTION IF EXISTS public.insert_birthday(text, text, text, integer, text, boolean, uuid);
DROP FUNCTION IF EXISTS public.user_exists_in_both_tables(uuid);
DROP FUNCTION IF EXISTS public.delete_user_completely(uuid);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own birthdays" ON public.birthdays;
DROP POLICY IF EXISTS "Users can insert their own birthdays" ON public.birthdays;
DROP POLICY IF EXISTS "Users can update their own birthdays" ON public.birthdays;
DROP POLICY IF EXISTS "Users can delete their own birthdays" ON public.birthdays;

-- Enable RLS on birthdays table
ALTER TABLE public.birthdays ENABLE ROW LEVEL SECURITY;

-- Create policies for birthdays table
CREATE POLICY "Users can view their own birthdays"
ON public.birthdays
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own birthdays"
ON public.birthdays
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own birthdays"
ON public.birthdays
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own birthdays"
ON public.birthdays
FOR DELETE
USING (auth.uid() = user_id);

-- Create debug function to check current auth.uid()
CREATE OR REPLACE FUNCTION public.debug_auth_uid()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN json_build_object(
    'current_auth_uid', auth.uid(),
    'is_authenticated', auth.role() = 'authenticated'
  );
END;
$$;

-- Create function to check if user exists in both auth and public tables
CREATE OR REPLACE FUNCTION public.user_exists_in_both_tables(user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  auth_exists boolean;
  public_exists boolean;
BEGIN
  -- Check auth.users table
  SELECT EXISTS (
    SELECT 1 FROM auth.users WHERE id = user_id
  ) INTO auth_exists;

  -- Check public.users table
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = user_id
  ) INTO public_exists;

  RETURN json_build_object(
    'exists_in_auth', auth_exists,
    'exists_in_public', public_exists
  );
END;
$$;

-- Create function to delete user completely
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from public.users first (this will trigger the auth deletion)
  DELETE FROM public.users WHERE id = user_id;
END;
$$;

-- Create trigger function to delete auth user when public user is deleted
CREATE OR REPLACE FUNCTION public.delete_auth_user_on_public_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

-- Create trigger to delete auth user when public user is deleted
CREATE TRIGGER delete_auth_user_trigger
AFTER DELETE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.delete_auth_user_on_public_delete();

-- Create stored procedure for inserting birthdays
CREATE OR REPLACE FUNCTION public.insert_birthday(
  p_name text,
  p_date text,
  p_relation text,
  p_reminder_days integer,
  p_user_id uuid,
  p_notes text DEFAULT NULL,
  p_google_calendar_linked boolean DEFAULT false
)
RETURNS public.birthdays
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result public.birthdays;
BEGIN
  -- Verify the user ID matches the authenticated user
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'User ID mismatch';
  END IF;

  -- Insert the birthday record
  INSERT INTO public.birthdays (
    name,
    date,
    relation,
    reminder_days,
    notes,
    google_calendar_linked,
    user_id
  ) VALUES (
    p_name,
    p_date::date,
    p_relation,
    p_reminder_days,
    p_notes,
    p_google_calendar_linked,
    p_user_id
  )
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.debug_auth_uid() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_exists_in_both_tables(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.delete_user_completely(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_birthday(text, text, text, integer, uuid, text, boolean) TO authenticated; 