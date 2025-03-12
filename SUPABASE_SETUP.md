# Supabase Setup Guide for WishOne

This guide will help you set up Supabase for your WishOne application.

## 1. Create a Supabase Account

1. Go to [Supabase](https://supabase.com/) and sign up for an account if you don't have one already.
2. Create a new project in Supabase.
3. Take note of your project URL and anon key, which you'll need for your environment variables.

## 2. Set Up Database Tables

You'll need to create the following tables in your Supabase database:

### Users Table

```sql
create table public.users (
  id uuid references auth.users not null primary key,
  created_at timestamp with time zone default now() not null,
  email text not null,
  full_name text,
  avatar_url text,
  settings jsonb
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policy to allow users to view and edit only their own data
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);
```

### Birthdays Table

```sql
create table public.birthdays (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references public.users not null,
  name text not null,
  date text not null,
  relation text not null,
  reminder_days integer not null,
  google_calendar_linked boolean default false,
  notes text
);

-- Enable Row Level Security
alter table public.birthdays enable row level security;

-- Create policy to allow users to view and edit only their own data
create policy "Users can view their own birthdays" on public.birthdays
  for select using (auth.uid() = user_id);

create policy "Users can insert their own birthdays" on public.birthdays
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own birthdays" on public.birthdays
  for update using (auth.uid() = user_id);

create policy "Users can delete their own birthdays" on public.birthdays
  for delete using (auth.uid() = user_id);
```

## 3. Set Up Authentication

1. In your Supabase dashboard, go to Authentication > Settings.
2. Configure your authentication providers (Email, Google, etc.).
3. For email authentication, you can enable "Confirm email" to require email verification.

## 4. Configure Environment Variables

1. Copy the `.env.local.example` file to `.env.local`:
   ```
   cp .env.local.example .env.local
   ```

2. Update the `.env.local` file with your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

## 5. Test Your Connection

1. Run your application.
2. Go to the Profile page.
3. Click on "Test Supabase Connection" to verify that your application can connect to Supabase.

## Troubleshooting

If you encounter connection issues:

1. Verify that your environment variables are correctly set.
2. Check that your Supabase project is active and not in maintenance mode.
3. Ensure that your IP address is not blocked by Supabase.
4. Check the browser console for any error messages.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 