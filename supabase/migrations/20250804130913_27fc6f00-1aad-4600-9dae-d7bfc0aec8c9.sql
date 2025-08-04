-- First, drop the check constraint to allow 'showroom' role
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add check constraint that includes 'showroom'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('buyer', 'admin', 'showroom'));

-- Now update the admin role to showroom in profiles
UPDATE public.profiles SET role = 'showroom' WHERE role = 'admin';

-- Add showroom profiles table for better organization
CREATE TABLE public.showroom_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  showroom_name text NOT NULL,
  location text,
  description text,
  phone text,
  email text,
  website text,
  logo_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.showroom_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view showroom profiles" 
ON public.showroom_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage their showroom profile" 
ON public.showroom_profiles 
FOR ALL 
USING (auth.uid() = admin_id);

-- Add updated_at trigger
CREATE TRIGGER update_showroom_profiles_updated_at
BEFORE UPDATE ON public.showroom_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add showroom_id reference to cars table
ALTER TABLE public.cars ADD COLUMN showroom_id uuid REFERENCES public.showroom_profiles(id);