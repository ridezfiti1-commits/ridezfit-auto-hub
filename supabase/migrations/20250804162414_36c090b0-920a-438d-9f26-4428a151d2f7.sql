-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('buyer', 'showroom', 'system_admin');

-- Create enum for showroom status
CREATE TYPE public.showroom_status AS ENUM ('active', 'inactive', 'pending');

-- Add status column to showroom_profiles for visibility control
ALTER TABLE public.showroom_profiles 
ADD COLUMN status showroom_status DEFAULT 'active'::showroom_status;

-- Update profiles table to use the new enum (migrate existing data first)
UPDATE public.profiles SET role = 'buyer' WHERE role IS NULL OR role = '';
UPDATE public.profiles SET role = 'showroom' WHERE role = 'showroom';

-- Add constraint to ensure role uses the enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- Create index for better performance on frequently queried fields
CREATE INDEX idx_showroom_profiles_status ON public.showroom_profiles(status);
CREATE INDEX idx_cars_showroom_status ON public.cars(showroom_id, status);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Create RLS policy for system admin access
CREATE POLICY "System admins can manage all showrooms" 
ON public.showroom_profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'system_admin'
  )
);

-- Create RLS policy for system admin to manage all cars
CREATE POLICY "System admins can manage all cars" 
ON public.cars 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'system_admin'
  )
);

-- Update existing RLS policies to include system admin access
DROP POLICY IF EXISTS "Anyone can view showroom profiles" ON public.showroom_profiles;
CREATE POLICY "Anyone can view active showroom profiles" 
ON public.showroom_profiles 
FOR SELECT 
USING (status = 'active' OR EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid() AND role IN ('showroom', 'system_admin')
));

-- Ensure showroom names are unique
ALTER TABLE public.showroom_profiles 
ADD CONSTRAINT unique_showroom_name UNIQUE (showroom_name);