-- Enable required extensions for scheduling HTTP requests
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

-- Create a public storage bucket for weekly reports if it doesn't exist
insert into storage.buckets (id, name, public)
values ('reports', 'reports', true)
on conflict (id) do nothing;

-- Allow public read access to the reports bucket (create only if it doesn't already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects' 
      AND policyname = 'Public read for reports'
  ) THEN
    CREATE POLICY "Public read for reports"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'reports');
  END IF;
END$$;

-- Unschedule existing weekly job if present to avoid duplicates
DO $$
BEGIN
  PERFORM cron.unschedule('weekly-crew-report');
EXCEPTION WHEN others THEN
  -- ignore if it doesn't exist
  NULL;
END$$;

-- Schedule the weekly report generation every Monday at 12:00 UTC
select
  cron.schedule(
    'weekly-crew-report',
    '0 12 * * 1',
    $$
    select
      net.http_post(
        url:='https://ygkhqtphdakzibuhjdnm.supabase.co/functions/v1/generate-weekly-report',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlna2hxdHBoZGFremlidWhqZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjY0NTUsImV4cCI6MjA2NzA0MjQ1NX0.RYsdD5syXdOd3wrXdFHTgfn0sTA2QQxQwBEkK1BvNfI"}'::jsonb,
        body:='{}'::jsonb
      ) as request_id;
    $$
  );