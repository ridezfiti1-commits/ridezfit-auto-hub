-- Create security definer functions for RLS policies
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create function to check if user is system admin
CREATE OR REPLACE FUNCTION public.is_system_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() = 'system_admin'::user_role;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

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

-- Update showroom profiles visibility policy to include status filtering
DROP POLICY IF EXISTS "Anyone can view showroom profiles" ON public.showroom_profiles;
CREATE POLICY "Anyone can view active showroom profiles" 
ON public.showroom_profiles 
FOR SELECT 
USING (
  status = 'active'::showroom_status OR 
  public.get_current_user_role() IN ('showroom'::user_role, 'system_admin'::user_role)
);

-- Create policy for system admin to manage all merchandise
CREATE POLICY "System admins can manage all merchandise" 
ON public.merchandise 
FOR ALL 
USING (public.is_system_admin());

-- Create policy for system admin to manage all services
CREATE POLICY "System admins can manage all services" 
ON public.services 
FOR ALL 
USING (public.is_system_admin());