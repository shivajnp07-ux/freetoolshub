/*
# Create profiles, favorites, and tool_history tables with RLS

1. New Tables
- `profiles` — user profile data, one row per authenticated user
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, user email)
  - `full_name` (text, display name)
  - `avatar_url` (text, nullable, URL to Supabase Storage avatar)
  - `created_at` (timestamptz, account creation time)
- `favorites` — bookmarked tools per user
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, defaults to auth.uid())
  - `tool_slug` (text, the tool slug from toolConfig)
  - `created_at` (timestamptz)
- `tool_history` — tracks every tool visit per user
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, defaults to auth.uid())
  - `tool_slug` (text, the tool slug from toolConfig)
  - `visited_at` (timestamptz)

2. Security
- RLS enabled on all three tables.
- profiles: users can read and update only their own profile row.
- favorites: users can CRUD only their own favorites.
- tool_history: users can read, insert, and delete only their own history.
- All policies scope to `TO authenticated` with `auth.uid()` ownership checks.
- `user_id` columns default to `auth.uid()` so inserts work without the client passing user_id.

3. Trigger
- `handle_new_user` trigger: after a new user is inserted into auth.users,
  automatically creates a corresponding profile row with the user's email
  and metadata full_name. This fires on signup so the profile always exists.

4. Indexes
- favorites: unique index on (user_id, tool_slug) to prevent duplicate favorites.
- tool_history: index on (user_id, visited_at desc) for efficient recent-activity queries.
*/

-- profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_select_own" ON favorites;
CREATE POLICY "favorites_select_own"
ON favorites FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_insert_own" ON favorites;
CREATE POLICY "favorites_insert_own"
ON favorites FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "favorites_delete_own" ON favorites;
CREATE POLICY "favorites_delete_own"
ON favorites FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS favorites_user_tool_unique
ON favorites (user_id, tool_slug);

-- tool_history table
CREATE TABLE IF NOT EXISTS tool_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug text NOT NULL,
  visited_at timestamptz DEFAULT now()
);

ALTER TABLE tool_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tool_history_select_own" ON tool_history;
CREATE POLICY "tool_history_select_own"
ON tool_history FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tool_history_insert_own" ON tool_history;
CREATE POLICY "tool_history_insert_own"
ON tool_history FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tool_history_delete_own" ON tool_history;
CREATE POLICY "tool_history_delete_own"
ON tool_history FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS tool_history_user_visited_idx
ON tool_history (user_id, visited_at DESC);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
