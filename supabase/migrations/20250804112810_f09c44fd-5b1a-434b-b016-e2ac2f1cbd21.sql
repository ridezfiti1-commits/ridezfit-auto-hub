-- Create dummy admin user profile for testing
-- First, we'll insert a test admin profile (the auth user will be created via the UI)
-- Using a known UUID for easy reference

-- Insert admin profile with known UUID for testing
INSERT INTO public.profiles (
  id,
  user_id, 
  email, 
  full_name, 
  role,
  phone
) VALUES (
  gen_random_uuid(),
  '550e8400-e29b-41d4-a716-446655440000', -- This will be the user_id when admin signs up
  'admin@ridezfiti.com',
  'Admin User',
  'admin',
  '+254700000000'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert some sample cars for the admin
INSERT INTO public.cars (
  admin_id,
  make,
  model,
  year,
  price,
  condition,
  mileage,
  fuel_type,
  transmission,
  engine_size,
  color,
  description,
  features,
  images,
  status
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Toyota',
  'Camry',
  2022,
  2500000,
  'new',
  5000,
  'Petrol',
  'Automatic',
  '2.5L',
  'White',
  'Brand new Toyota Camry with advanced safety features and excellent fuel economy.',
  ARRAY['Backup Camera', 'Bluetooth', 'Cruise Control', 'Leather Seats'],
  ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop'],
  'available'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'BMW',
  'X5',
  2021,
  4500000,
  'certified',
  15000,
  'Petrol',
  'Automatic',
  '3.0L',
  'Black',
  'Certified pre-owned BMW X5 with premium features and excellent performance.',
  ARRAY['Navigation', 'Sunroof', 'Premium Sound', 'All-Wheel Drive'],
  ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop'],
  'available'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Honda',
  'Civic',
  2020,
  1800000,
  'used',
  25000,
  'Petrol',
  'Manual',
  '1.8L',
  'Red',
  'Well-maintained Honda Civic with excellent fuel economy and reliability.',
  ARRAY['Backup Camera', 'Bluetooth', 'Manual Transmission'],
  ARRAY['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop'],
  'available'
);

-- Insert some sample merchandise
INSERT INTO public.merchandise (
  admin_id,
  title,
  category,
  price,
  description,
  stock_quantity,
  image_url
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Premium Car Mats',
  'Interior',
  15000,
  'High-quality rubber car mats for all weather protection.',
  50,
  'https://images.unsplash.com/photo-1562519819-016-d-99-6e2?w=400&h=400&fit=crop'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'LED Headlight Bulbs',
  'Lighting',
  8000,
  'Bright LED headlight bulbs for better visibility and style.',
  25,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Car Phone Mount',
  'Electronics',
  3500,
  'Secure and adjustable phone mount for hands-free driving.',
  100,
  'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=400&h=400&fit=crop'
);

-- Insert some sample services
INSERT INTO public.services (
  admin_id,
  title,
  category,
  price,
  description,
  duration,
  image_url
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Full Car Detailing',
  'Maintenance',
  12000,
  'Complete interior and exterior car detailing service.',
  '3 hours',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Oil Change Service',
  'Maintenance',
  4500,
  'Professional oil change with premium oil and filter.',
  '30 minutes',
  'https://images.unsplash.com/photo-1609650107436-cae7c63e65b0?w=400&h=300&fit=crop'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Brake Inspection',
  'Safety',
  6000,
  'Comprehensive brake system inspection and maintenance.',
  '1 hour',
  'https://images.unsplash.com/photo-1609650107436-cae7c63e65b0?w=400&h=300&fit=crop'
);