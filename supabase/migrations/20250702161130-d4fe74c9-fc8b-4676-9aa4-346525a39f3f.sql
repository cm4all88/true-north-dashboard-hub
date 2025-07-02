
-- Create table to cache weather data
CREATE TABLE public.weather_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL DEFAULT 'Seattle',
  current_temp INTEGER NOT NULL,
  current_condition TEXT NOT NULL,
  forecast JSONB NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.weather_cache ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to weather data" 
  ON public.weather_cache 
  FOR SELECT 
  USING (true);

-- Create policy for public write access (for edge function)
CREATE POLICY "Allow public write access to weather data" 
  ON public.weather_cache 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for public update access (for edge function)
CREATE POLICY "Allow public update access to weather data" 
  ON public.weather_cache 
  FOR UPDATE 
  USING (true);

-- Create index for faster lookups
CREATE INDEX weather_cache_location_idx ON public.weather_cache(location);
CREATE INDEX weather_cache_last_updated_idx ON public.weather_cache(last_updated);
