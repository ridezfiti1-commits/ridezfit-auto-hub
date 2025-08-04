# RidezFiti Admin Login Instructions

## How to Access the Admin Dashboard

### Step 1: Create Admin Account
1. Go to the **Sign Up** page (`/auth`)
2. Create a new account with these details:
   - **Email:** `admin@ridezfiti.com` (or any email you prefer)
   - **Password:** Choose a secure password
   - **Full Name:** `Admin User`

### Step 2: Update Your Role
After creating the account, you need to manually update your role in the database:

1. Go to your Supabase dashboard: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Navigate to your project
3. Go to **Table Editor** → **profiles** table
4. Find your newly created profile
5. Edit the `role` field from `buyer` to `admin`
6. Save the changes

### Step 3: Access Admin Features
1. Sign in with your admin account
2. Go to the **Dashboard** page (`/dashboard`)
3. You'll now have access to:
   - **Car Management** - Add, edit, and delete vehicle listings
   - **Merchandise Management** - Manage car accessories and parts
   - **Service Management** - Handle service offerings
   - **Order Management** - View and process all customer orders

## Sample Data Available

The application comes with sample data including:
- **4 Cars** (Toyota Camry, BMW X5, Honda Civic, Mercedes C-Class)
- **4 Merchandise Items** (Car mats, LED bulbs, phone mount, air freshener)
- **4 Services** (Car detailing, oil change, brake inspection, tire rotation)

## Admin Dashboard Features

### 🚗 Car Management
- Add new vehicles with detailed specifications
- Upload multiple car images
- Set pricing and availability status
- Edit existing listings

### 🛍️ Merchandise Management
- Add car accessories and parts
- Manage inventory levels
- Set categories and pricing
- Upload product images

### 🔧 Service Management
- Create service offerings
- Set duration and pricing
- Manage service categories
- Upload service images

### 📦 Order Management
- View all customer orders
- Track payment status
- Update order status
- Manage order fulfillment

## Security Note

The sample data uses a placeholder admin ID. Once you create your admin account and update your role, you can start adding your own inventory that will be properly linked to your user account.

## Support

If you encounter any issues:
1. Ensure your user role is set to `admin` in the profiles table
2. Make sure you're signed in with the correct account
3. Check the browser console for any error messages
4. Verify your internet connection for database operations

---

**Happy selling with RidezFiti! 🚗✨**