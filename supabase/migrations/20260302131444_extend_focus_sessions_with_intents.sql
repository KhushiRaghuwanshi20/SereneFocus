/*
  # Extend Focus Sessions with Intent and Reflection

  1. New Columns
    - `session_type` (text) - Type of session: 'focus' (25m), 'short_break' (5m), 'long_break' (15m)
    - `intent` (text) - Pre-session goal/intention
    - `reflection` (text) - Post-session reflection/outcome
    - `user_profile_photo_url` (text) - User's profile picture URL

  2. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, foreign key to auth.users)
      - `full_name` (text) - User's full name
      - `bio` (text) - User's bio
      - `profile_photo_url` (text) - Uploaded profile picture
      - `updated_at` (timestamptz)

  3. Security
    - Enable RLS on user_profiles
    - Users can only read/update their own profile
*/

DO $$
BEGIN
  -- Add new columns to focus_sessions if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'focus_sessions' AND column_name = 'session_type'
  ) THEN
    ALTER TABLE focus_sessions ADD COLUMN session_type text DEFAULT 'focus';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'focus_sessions' AND column_name = 'intent'
  ) THEN
    ALTER TABLE focus_sessions ADD COLUMN intent text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'focus_sessions' AND column_name = 'reflection'
  ) THEN
    ALTER TABLE focus_sessions ADD COLUMN reflection text;
  END IF;
END $$;

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT 'Khushi Raghuwanshi',
  bio text DEFAULT '3rd Year CSE Student',
  profile_photo_url text,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT DO NOTHING;