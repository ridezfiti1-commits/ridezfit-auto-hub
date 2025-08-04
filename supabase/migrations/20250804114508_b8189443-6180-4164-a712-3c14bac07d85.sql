-- Create sample cars for testing (without foreign key dependency)
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
  '00000000-0000-0000-0000-000000000001',
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
  '00000000-0000-0000-0000-000000000001',
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
  '00000000-0000-0000-0000-000000000001',
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
),
(
  '00000000-0000-0000-0000-000000000001',
  'Mercedes-Benz',
  'C-Class',
  2023,
  3200000,
  'new',
  2000,
  'Petrol',
  'Automatic',
  '2.0L',
  'Silver',
  'Luxury Mercedes-Benz C-Class with premium interior and advanced technology.',
  ARRAY['Premium Sound', 'Navigation', 'Heated Seats', 'Sunroof'],
  ARRAY['https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=600&fit=crop'],
  'available'
);

-- Insert sample merchandise
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
  '00000000-0000-0000-0000-000000000001',
  'Premium Car Mats',
  'Interior',
  15000,
  'High-quality rubber car mats for all weather protection.',
  50,
  'https://images.unsplash.com/photo-1562519819-016-d-99-6e2?w=400&h=400&fit=crop'
),
(
  '00000000-0000-0000-0000-000000000001',
  'LED Headlight Bulbs',
  'Lighting',
  8000,
  'Bright LED headlight bulbs for better visibility and style.',
  25,
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Car Phone Mount',
  'Electronics',
  3500,
  'Secure and adjustable phone mount for hands-free driving.',
  100,
  'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=400&h=400&fit=crop'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Car Air Freshener',
  'Interior',
  1200,
  'Long-lasting car air freshener with multiple scent options.',
  200,
  'https://images.unsplash.com/photo-1566895291281-0e0cd74f0fd5?w=400&h=400&fit=crop'
);

-- Insert sample services
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
  '00000000-0000-0000-0000-000000000001',
  'Full Car Detailing',
  'Maintenance',
  12000,
  'Complete interior and exterior car detailing service.',
  '3 hours',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Oil Change Service',
  'Maintenance',
  4500,
  'Professional oil change with premium oil and filter.',
  '30 minutes',
  'https://images.unsplash.com/photo-1609650107436-cae7c63e65b0?w=400&h=300&fit=crop'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Brake Inspection',
  'Safety',
  6000,
  'Comprehensive brake system inspection and maintenance.',
  '1 hour',
  'https://images.unsplash.com/photo-1609650107436-cae7c63e65b0?w=400&h=300&fit=crop'
),
(
  '00000000-0000-0000-0000-000000000001',
  'Tire Rotation',
  'Maintenance',
  3000,
  'Professional tire rotation and alignment check.',
  '45 minutes',
  'https://images.unsplash.com/photo-1609650107436-cae7c63e65b0?w=400&h=300&fit=crop'
);