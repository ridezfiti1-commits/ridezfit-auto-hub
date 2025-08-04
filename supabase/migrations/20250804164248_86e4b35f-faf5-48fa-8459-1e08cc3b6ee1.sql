-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('buyer', 'showroom', 'system_admin');

-- Create enum for showroom status  
CREATE TYPE public.showroom_status AS ENUM ('active', 'inactive', 'pending');

-- Add status column to showroom_profiles
ALTER TABLE public.showroom_profiles 
ADD COLUMN status showroom_status DEFAULT 'active'::showroom_status;

-- Remove default constraint from role column temporarily
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Update existing data
UPDATE public.profiles SET role = 'buyer' WHERE role IS NULL OR role = '';

-- Convert role column to enum type
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- Set default back
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'buyer'::user_role;

-- Create performance indexes
CREATE INDEX idx_showroom_profiles_status ON public.showroom_profiles(status);
CREATE INDEX idx_cars_showroom_status ON public.cars(showroom_id, status);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Add unique constraint for showroom names
ALTER TABLE public.showroom_profiles 
ADD CONSTRAINT unique_showroom_name UNIQUE (showroom_name);