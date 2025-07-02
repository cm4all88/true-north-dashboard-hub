
-- Create table for crew schedule data
CREATE TABLE public.crew_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_of TEXT NOT NULL,
  week_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for crew members
CREATE TABLE public.crew_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES public.crew_schedules(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for schedule items (individual day entries)
CREATE TABLE public.schedule_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crew_member_id UUID REFERENCES public.crew_members(id) ON DELETE CASCADE,
  day_index INTEGER NOT NULL, -- 0-4 for Monday-Friday
  row1_color TEXT DEFAULT 'none',
  row1_job_number TEXT DEFAULT '',
  row1_job_name TEXT DEFAULT '',
  row2_color TEXT DEFAULT 'none',
  row2_job_number TEXT DEFAULT '',
  row2_job_name TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for birthdays
CREATE TABLE public.birthdays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for shoutouts
CREATE TABLE public.shoutouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  from_person TEXT NOT NULL,
  date_posted DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (making data publicly accessible for now)
ALTER TABLE public.crew_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birthdays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shoutouts ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (since this is a dashboard app)
CREATE POLICY "Allow public read access" ON public.crew_schedules FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.crew_schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.crew_schedules FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.crew_schedules FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.crew_members FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.crew_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.crew_members FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.crew_members FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.schedule_items FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.schedule_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.schedule_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.schedule_items FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.birthdays FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.birthdays FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.birthdays FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.birthdays FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.shoutouts FOR SELECT USING (true);
CREATE POLICY "Allow public write access" ON public.shoutouts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.shoutouts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.shoutouts FOR DELETE USING (true);
