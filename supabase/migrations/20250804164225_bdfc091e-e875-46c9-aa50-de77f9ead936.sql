-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('buyer', 'showroom', 'system_admin');

-- Create enum for showroom status
CREATE TYPE public.showroom_status AS ENUM ('active', 'inactive', 'pending');

-- Add status column to showroom_profiles for visibility control
ALTER TABLE public.showroom_profiles 
ADD COLUMN status showroom_status DEFAULT 'active'::showroom_status;

-- First remove the default constraint from role column
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Update existing data to ensure compatibility
UPDATE public.profiles SET role = 'buyer' WHERE role IS NULL OR role = '';

-- Convert the column to use the enum type
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- Add back the default value
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'buyer'::user_role;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user is system admin
CREATE OR REPLACE FUNCTION public.is_system_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() = 'system_admin'::user_role;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user has specific roles
CREATE OR REPLACE FUNCTION public.has_role_in(roles user_role[])
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() = ANY(roles);
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create indexes for better performance
CREATE INDEX idx_showroom_profiles_status ON public.showroom_profiles(status);
CREATE INDEX idx_cars_showroom_status ON public.cars(showroom_id, status);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Create RLS policy for system admin access to showrooms
CREATE POLICY "System admins can manage all showrooms" 
ON public.showroom_profiles 
FOR ALL 
USING (public.is_system_admin());

-- Create RLS policy for system admin access to cars
CREATE POLICY "System admins can manage all cars" 
ON public.cars 
FOR ALL 
USING (public.is_system_admin());

-- Update showroom profiles visibility policy
DROP POLICY IF EXISTS "Anyone can view showroom profiles" ON public.showroom_profiles;
CREATE POLICY "Anyone can view active showroom profiles" 
ON public.showroom_profiles 
FOR SELECT 
USING (
  status = 'active'::showroom_status OR 
  public.has_role_in(ARRAY['showroom'::user_role, 'system_admin'::user_role])
);

-- Ensure showroom names are unique
ALTER TABLE public.showroom_profiles 
ADD CONSTRAINT unique_showroom_name UNIQUE (showroom_name);