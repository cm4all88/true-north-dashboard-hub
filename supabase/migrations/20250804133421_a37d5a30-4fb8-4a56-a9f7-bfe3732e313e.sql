-- Add field dates to schedule items for automatic week assignment
ALTER TABLE public.schedule_items 
ADD COLUMN row1_field_date date,
ADD COLUMN row2_field_date date;

-- Add index for better performance when querying by field dates
CREATE INDEX idx_schedule_items_row1_field_date ON public.schedule_items(row1_field_date);
CREATE INDEX idx_schedule_items_row2_field_date ON public.schedule_items(row2_field_date);