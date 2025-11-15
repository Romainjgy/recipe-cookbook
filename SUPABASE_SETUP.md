# Supabase Setup Instructions

## Step 1: Create the Database Table

Go to your Supabase dashboard: https://kywmifigugvwisdyoyoz.supabase.co

Navigate to **SQL Editor** and run this SQL:

```sql
-- Create recipes table
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  prep_time TEXT,
  cook_time TEXT,
  servings TEXT,
  image TEXT,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (public access)
CREATE POLICY "Allow all access to recipes" 
ON recipes 
FOR ALL 
USING (true) 
WITH CHECK (true);
```

## Step 2: Add Environment Variables to Netlify

1. Go to your Netlify dashboard: https://app.netlify.com/sites/eloquent-toffee-6d5691/configuration/env

2. Add these environment variables:

   - **SUPABASE_URL**: `https://kywmifigugvwisdyoyoz.supabase.co`
   - **SUPABASE_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5d21pZmlndWd2d2lzZHlveW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDY1NTksImV4cCI6MjA3ODc4MjU1OX0.xzsNryBULTvyAP5WEOKVTuDVEsy8ixL24iEudGqIoxo`

3. Save and trigger a new deploy

## Step 3: Deploy to Netlify

Run these commands:

```bash
git add .
git commit -m "Switch to Supabase for persistent storage"
git push origin main
```

Netlify will automatically deploy your changes!

## Done! 🎉

Your recipes will now persist permanently in Supabase's PostgreSQL database. No more data loss!
