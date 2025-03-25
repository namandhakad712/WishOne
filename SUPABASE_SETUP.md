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
  settings jsonb,
  last_login timestamp with time zone
);

-- Enable Row Level Security
alter table public.users enable row level security;

-- Create policy to allow users to view and edit only their own data
create policy "Users can view their own data" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on public.users
  for update using (auth.uid() = id);

-- Create policy to allow new user insertion during signup
create policy "Users can insert their own data" on public.users
  for insert with check (auth.uid() = id);
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
  notes text,
  gift_ideas text[],
  last_modified timestamp with time zone default now()
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

### Chat Messages Table

```sql
create table public.chat_messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default now() not null,
  user_id uuid references public.users not null,
  message text not null,
  is_ai boolean default false,
  birthday_id uuid references public.birthdays null
);

-- Enable Row Level Security
alter table public.chat_messages enable row level security;

-- Create policy to allow users to view and edit only their own data
create policy "Users can view their own chat messages" on public.chat_messages
  for select using (auth.uid() = user_id);

create policy "Users can insert their own chat messages" on public.chat_messages
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own chat messages" on public.chat_messages
  for delete using (auth.uid() = user_id);
```

### Create Functions and Triggers

```sql
-- Function to update last_modified timestamp
create or replace function update_last_modified()
returns trigger as $$
begin
  new.last_modified = now();
  return new;
end;
$$ language plpgsql;

-- Create a trigger on the birthdays table
create trigger birthdays_last_modified
before update on public.birthdays
for each row execute procedure update_last_modified();
```

## 3. Set Up Authentication

1. In your Supabase dashboard, go to Authentication > Settings.
2. Configure your authentication providers:
   
   ### Email Authentication
   - Enable "Email" as a provider
   - Configure "Confirm email" to require email verification
   - Set a secure password policy
   
   ### Google Authentication (Optional)
   - Enable "Google" as a provider
   - Create a Google OAuth application in Google Cloud Console
   - Add the Client ID and Secret to Supabase
   - Configure the redirect URLs in both Google Cloud Console and Supabase

## 4. Configure Environment Variables

1. Copy the `.env.local.example` file to `.env.local`:
   ```
   cp .env.local.example .env.local
   ```

2. Update the `.env.local` file with your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

## 5. Set Up Storage Buckets

1. In your Supabase dashboard, go to Storage.
2. Create the following buckets:
   - `avatars` - For user profile pictures
   - `birthday-images` - For birthday-related images

3. Configure bucket permissions:

```sql
-- Allow users to upload their own avatar
create policy "Users can upload their own avatar"
on storage.objects for insert
with check (
  bucket_id = 'avatars' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Allow users to read any avatar
create policy "Anyone can view avatars"
on storage.objects for select
using (bucket_id = 'avatars');

-- Allow users to upload birthday images
create policy "Users can upload birthday images"
on storage.objects for insert
with check (
  bucket_id = 'birthday-images' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);

-- Allow users to read their own birthday images
create policy "Users can view their own birthday images"
on storage.objects for select
using (
  bucket_id = 'birthday-images' AND
  auth.uid() = (storage.foldername(name))[1]::uuid
);
```

## 6. Test Your Connection

1. Run your application locally:
   ```
   npm run dev
   ```

2. Go to the Profile page.
3. Click on "Test Supabase Connection" to verify that your application can connect to Supabase.
4. Try creating a new account and adding a birthday to verify database operations.

## 7. Set Up Database Backups (Optional)

1. For production environments, set up regular database backups:
   - Go to Database > Settings > Backups
   - Configure the backup schedule

## Troubleshooting

If you encounter connection issues:

1. Verify that your environment variables are correctly set.
2. Check that your Supabase project is active and not in maintenance mode.
3. Ensure that your IP address is not blocked by Supabase.
4. Check the browser console for any error messages.
5. Verify RLS policies if you're getting permission errors.

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage) 