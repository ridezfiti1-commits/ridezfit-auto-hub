-- Add view counts to cars table
ALTER TABLE public.cars ADD COLUMN view_count INTEGER DEFAULT 0;

-- Add stock count and video URL to cars table  
ALTER TABLE public.cars ADD COLUMN stock_count INTEGER DEFAULT 1;
ALTER TABLE public.cars ADD COLUMN video_url TEXT;

-- Create view tracking trigger function
CREATE OR REPLACE FUNCTION public.increment_car_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.cars 
  SET view_count = COALESCE(view_count, 0) + 1 
  WHERE id = NEW.car_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create car_views table for tracking views
CREATE TABLE public.car_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  car_id UUID NOT NULL,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on car_views
ALTER TABLE public.car_views ENABLE ROW LEVEL SECURITY;

-- Create policies for car_views
CREATE POLICY "Anyone can create car views" 
ON public.car_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view car view records" 
ON public.car_views 
FOR SELECT 
USING (true);

-- Create trigger for car view counting
CREATE TRIGGER car_view_count_trigger
  AFTER INSERT ON public.car_views
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_car_view_count();

-- Create indexes for performance
CREATE INDEX idx_car_views_car_id ON public.car_views(car_id);
CREATE INDEX idx_car_views_created_at ON public.car_views(created_at);

-- Add showroom stats columns
ALTER TABLE public.showroom_profiles ADD COLUMN total_views INTEGER DEFAULT 0;
ALTER TABLE public.showroom_profiles ADD COLUMN total_visits INTEGER DEFAULT 0;