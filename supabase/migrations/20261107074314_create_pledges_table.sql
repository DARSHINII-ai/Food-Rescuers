/*
# Create pledges table for FoodBridge homepage

1. New Tables
- `pledges`
  - `id` (uuid, primary key)
  - `name` (text, required, 1 to 80 characters)
  - `email` (text, required, 3 to 254 characters)
  - `pledge_type` (text, one of 'donate', 'volunteer', 'partner')
  - `created_at` (timestamptz, defaults to now)

2. New Function
- `get_pledge_counts()` returns the number of pledges per type. It exposes counts only, never names or emails.

3. Security
- RLS enabled on `pledges`.
- Anonymous visitors may INSERT a pledge only. They cannot read, update, or delete any pledge rows, so personal details stay private.
- `get_pledge_counts()` runs with owner rights and is granted to anonymous visitors so the homepage counter can show totals.

4. Important Notes
- No sign-in is required for this homepage, so policies apply to the anonymous role.
- Input length and type checks are enforced at the database level as a backstop to the form.
*/

CREATE TABLE IF NOT EXISTS pledges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254),
  pledge_type text NOT NULL CHECK (pledge_type IN ('donate', 'volunteer', 'partner')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON pledges TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_pledges" ON pledges;
CREATE POLICY "anon_insert_pledges" ON pledges FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION get_pledge_counts()
RETURNS TABLE (pledge_type text, total bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.pledge_type, count(*)::bigint AS total
  FROM pledges p
  GROUP BY p.pledge_type;
$$;

REVOKE EXECUTE ON FUNCTION get_pledge_counts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_pledge_counts() TO anon, authenticated;
