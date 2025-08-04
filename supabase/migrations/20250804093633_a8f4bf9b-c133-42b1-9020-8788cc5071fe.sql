-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'buyer' CHECK (role IN ('buyer', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cars table
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('new', 'used', 'certified')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  mileage INTEGER,
  fuel_type TEXT,
  transmission TEXT,
  engine_size TEXT,
  color TEXT,
  description TEXT,
  features TEXT[],
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create merchandise table
CREATE TABLE public.merchandise (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  duration TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  order_type TEXT NOT NULL CHECK (order_type IN ('car', 'merchandise', 'service')),
  item_id UUID NOT NULL,
  quantity INTEGER DEFAULT 1,
  total_amount DECIMAL(12,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'hire_purchase')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'fulfilled', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('car', 'merchandise', 'service')),
  item_id UUID NOT NULL,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('car', 'merchandise', 'service')),
  item_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchandise ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cars
CREATE POLICY "Anyone can view available cars" ON public.cars FOR SELECT USING (status = 'available' OR auth.uid() = admin_id);
CREATE POLICY "Admins can manage their cars" ON public.cars FOR ALL USING (auth.uid() = admin_id);

-- RLS Policies for merchandise
CREATE POLICY "Anyone can view merchandise" ON public.merchandise FOR SELECT USING (true);
CREATE POLICY "Admins can manage their merchandise" ON public.merchandise FOR ALL USING (auth.uid() = admin_id);

-- RLS Policies for services
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage their services" ON public.services FOR ALL USING (auth.uid() = admin_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for cart_items
CREATE POLICY "Users can manage their own cart" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for favorites
CREATE POLICY "Users can manage their own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON public.cars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_merchandise_updated_at BEFORE UPDATE ON public.merchandise FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
-- Sample admin profile (will be created when user signs up)
-- Sample cars
INSERT INTO public.cars (admin_id, make, model, year, price, condition, mileage, fuel_type, transmission, engine_size, color, description, features, images) VALUES
('00000000-0000-0000-0000-000000000001', 'Toyota', 'Camry', 2023, 28500.00, 'new', 0, 'Gasoline', 'Automatic', '2.5L', 'Silver', 'Brand new Toyota Camry with latest features and excellent fuel economy.', ARRAY['LED Headlights', 'Backup Camera', 'Bluetooth', 'Apple CarPlay'], ARRAY['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800']),
('00000000-0000-0000-0000-000000000001', 'Honda', 'Civic', 2022, 24000.00, 'used', 15000, 'Gasoline', 'Manual', '1.5L', 'Blue', 'Excellent condition Honda Civic with low mileage and full service history.', ARRAY['Sunroof', 'Heated Seats', 'Navigation'], ARRAY['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800']),
('00000000-0000-0000-0000-000000000001', 'BMW', 'X5', 2021, 52000.00, 'certified', 25000, 'Gasoline', 'Automatic', '3.0L', 'Black', 'Luxury BMW X5 with premium features and excellent performance.', ARRAY['Leather Seats', 'Panoramic Roof', 'Premium Sound', 'All-Wheel Drive'], ARRAY['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800']),
('00000000-0000-0000-0000-000000000001', 'Ford', 'Mustang', 2023, 35000.00, 'new', 0, 'Gasoline', 'Manual', '5.0L', 'Red', 'Iconic Ford Mustang with powerful V8 engine and classic styling.', ARRAY['Performance Package', 'Premium Audio', 'Racing Stripes'], ARRAY['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', 'https://images.unsplash.com/photo-1594736797933-d0851ba0fe65?w=800']);

-- Sample merchandise
INSERT INTO public.merchandise (admin_id, title, description, price, category, image_url, stock_quantity) VALUES
('00000000-0000-0000-0000-000000000001', 'Premium Car Mats', 'High-quality rubber car mats for all weather protection', 89.99, 'Interior', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400', 50),
('00000000-0000-0000-0000-000000000001', 'LED Headlight Kit', 'Ultra-bright LED headlight conversion kit', 159.99, 'Lighting', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 25),
('00000000-0000-0000-0000-000000000001', 'Performance Air Filter', 'High-flow air filter for improved engine performance', 49.99, 'Engine', 'https://images.unsplash.com/photo-1486745229908-5f8b24b6c172?w=400', 75),
('00000000-0000-0000-0000-000000000001', 'Alloy Wheels Set', 'Stylish 18-inch alloy wheels set of 4', 899.99, 'Wheels', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400', 12);

-- Sample services
INSERT INTO public.services (admin_id, title, description, price, category, duration, image_url) VALUES
('00000000-0000-0000-0000-000000000001', 'Full Car Detailing', 'Complete interior and exterior car detailing service', 199.99, 'Detailing', '3-4 hours', 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400'),
('00000000-0000-0000-0000-000000000001', 'Window Tinting', 'Professional window tinting service for all windows', 299.99, 'Tinting', '2-3 hours', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'),
('00000000-0000-0000-0000-000000000001', 'Oil Change Service', 'Full oil change with premium oil and filter replacement', 79.99, 'Maintenance', '30 minutes', 'https://images.unsplash.com/photo-1486754735734-325b5831c3ad?w=400'),
('00000000-0000-0000-0000-000000000001', 'Brake Inspection', 'Comprehensive brake system inspection and report', 89.99, 'Inspection', '1 hour', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400');