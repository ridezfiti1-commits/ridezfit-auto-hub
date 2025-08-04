-- Create enum types
CREATE TYPE public.user_role AS ENUM ('buyer', 'showroom', 'system_admin');
CREATE TYPE public.showroom_status AS ENUM ('active', 'inactive', 'pending');

-- Add status column to showroom_profiles
ALTER TABLE public.showroom_profiles 
ADD COLUMN status showroom_status DEFAULT 'active'::showroom_status;

-- Add new role column with enum type
ALTER TABLE public.profiles 
ADD COLUMN role_new user_role DEFAULT 'buyer'::user_role;

-- Migrate data from old role column to new enum column
UPDATE public.profiles 
SET role_new = CASE 
  WHEN role = 'showroom' THEN 'showroom'::user_role
  WHEN role = 'system_admin' THEN 'system_admin'::user_role  
  ELSE 'buyer'::user_role
END;

-- Drop old role column and rename new one
ALTER TABLE public.profiles DROP COLUMN role;
ALTER TABLE public.profiles RENAME COLUMN role_new TO role;

-- Set NOT NULL constraint
ALTER TABLE public.profiles ALTER COLUMN role SET NOT NULL;

-- Create performance indexes
CREATE INDEX idx_showroom_profiles_status ON public.showroom_profiles(status);
CREATE INDEX idx_cars_showroom_status ON public.cars(showroom_id, status);
CREATE INDEX idx_profiles_role ON public.profiles(role);

-- Add unique constraint for showroom names
ALTER TABLE public.showroom_profiles 
ADD CONSTRAINT unique_showroom_name UNIQUE (showroom_name);