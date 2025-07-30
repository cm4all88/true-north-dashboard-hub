-- Add callouts columns to crew_schedules table
ALTER TABLE public.crew_schedules 
ADD COLUMN vacation_callouts text[],
ADD COLUMN sick_callouts text[];