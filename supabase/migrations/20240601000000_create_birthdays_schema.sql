-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  phone_number TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create birthdays table
CREATE TABLE IF NOT EXISTS public.birthdays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  relation TEXT NOT NULL,
  reminder_days INTEGER NOT NULL DEFAULT 7,
  google_calendar_linked BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS birthdays_user_id_idx ON public.birthdays(user_id);
CREATE INDEX IF NOT EXISTS birthdays_date_idx ON public.birthdays(date);

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER birthdays_updated_at
BEFORE UPDATE ON public.birthdays
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthdays ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY users_select_own ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY users_update_own ON public.users
FOR UPDATE USING (auth.uid() = id);

-- Create policies for birthdays table
CREATE POLICY birthdays_select_own ON public.birthdays
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY birthdays_insert_own ON public.birthdays
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY birthdays_update_own ON public.birthdays
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY birthdays_delete_own ON public.birthdays
FOR DELETE USING (auth.uid() = user_id);
