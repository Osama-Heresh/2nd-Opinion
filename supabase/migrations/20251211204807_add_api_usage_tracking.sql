/*
  # Add API Usage Tracking and Caching

  1. New Tables
    - `api_usage` - Track Gemini API calls per day
      - `id` (uuid, primary key)
      - `date` (date)
      - `calls_count` (integer)
      - `tokens_used` (integer)
      - `created_at` (timestamp)
      
    - `symptom_cache` - Cache refined symptoms to avoid duplicate API calls
      - `id` (uuid, primary key)
      - `raw_text` (text, indexed)
      - `refined_text` (text)
      - `hash` (text, unique) - SHA256 hash of raw_text for fast lookup
      - `usage_count` (integer) - How many times this cache was hit
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Service role can manage api_usage
    - Anyone can read symptom_cache (for performance)
    - Only service role can write symptom_cache

  3. Indexes
    - Index on date for api_usage
    - Unique index on hash for symptom_cache
    - Index on created_at for cache cleanup
*/

-- Create api_usage table
CREATE TABLE IF NOT EXISTS api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  calls_count integer DEFAULT 0,
  tokens_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create unique index on date
CREATE UNIQUE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage(date);

-- Enable RLS
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Service role full access for api_usage
CREATE POLICY "Service role can manage api_usage"
  ON api_usage FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Admins can view api_usage
CREATE POLICY "Admins can view api_usage"
  ON api_usage FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'ADMIN'
  ));

-- Create symptom_cache table
CREATE TABLE IF NOT EXISTS symptom_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_text text NOT NULL,
  refined_text text NOT NULL,
  hash text UNIQUE NOT NULL,
  usage_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for symptom_cache
CREATE UNIQUE INDEX IF NOT EXISTS idx_symptom_cache_hash ON symptom_cache(hash);
CREATE INDEX IF NOT EXISTS idx_symptom_cache_created ON symptom_cache(created_at);

-- Enable RLS
ALTER TABLE symptom_cache ENABLE ROW LEVEL SECURITY;

-- Anyone can read cache (for performance)
CREATE POLICY "Anyone can read symptom_cache"
  ON symptom_cache FOR SELECT
  TO anon, authenticated
  USING (true);

-- Service role can manage cache
CREATE POLICY "Service role can manage symptom_cache"
  ON symptom_cache FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to increment API usage
CREATE OR REPLACE FUNCTION increment_api_usage(tokens integer DEFAULT 1000)
RETURNS void AS $$
BEGIN
  INSERT INTO api_usage (date, calls_count, tokens_used)
  VALUES (CURRENT_DATE, 1, tokens)
  ON CONFLICT (date) 
  DO UPDATE SET 
    calls_count = api_usage.calls_count + 1,
    tokens_used = api_usage.tokens_used + tokens;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check daily limit (10k calls or 1M tokens per day as safety)
CREATE OR REPLACE FUNCTION check_api_limit()
RETURNS boolean AS $$
DECLARE
  today_usage RECORD;
BEGIN
  SELECT calls_count, tokens_used 
  INTO today_usage
  FROM api_usage 
  WHERE date = CURRENT_DATE;
  
  -- If no record, we're fine
  IF NOT FOUND THEN
    RETURN true;
  END IF;
  
  -- Check limits (adjust these based on your needs)
  IF today_usage.calls_count >= 10000 OR today_usage.tokens_used >= 1000000 THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old cache (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM symptom_cache 
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND usage_count < 2; -- Keep frequently used items
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
