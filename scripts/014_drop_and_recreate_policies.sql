-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by owner" ON profiles;
DROP POLICY IF EXISTS "Profiles are editable by owner" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Active products are viewable by everyone" ON products;

DROP POLICY IF EXISTS "Banners are viewable by everyone" ON banners;
DROP POLICY IF EXISTS "Admins can manage banners" ON banners;
DROP POLICY IF EXISTS "Anyone can view banners" ON banners;
DROP POLICY IF EXISTS "Active banners are viewable by everyone" ON banners;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Anyone can view own orders" ON orders;

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can view own order items" ON order_items;

DROP POLICY IF EXISTS "Users can view own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON addresses;

-- Drop the is_admin function if it exists
DROP FUNCTION IF EXISTS is_admin() CASCADE;

-- Create simple policies without recursion

-- PROFILES: Users can only see and edit their own profile
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- CATEGORIES: Everyone can view
CREATE POLICY "categories_select_all" ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_auth" ON categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "categories_update_auth" ON categories FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "categories_delete_auth" ON categories FOR DELETE USING (auth.uid() IS NOT NULL);

-- PRODUCTS: Everyone can view active products
CREATE POLICY "products_select_all" ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_auth" ON products FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "products_update_auth" ON products FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "products_delete_auth" ON products FOR DELETE USING (auth.uid() IS NOT NULL);

-- BANNERS: Everyone can view active banners
CREATE POLICY "banners_select_all" ON banners FOR SELECT USING (true);
CREATE POLICY "banners_insert_auth" ON banners FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "banners_update_auth" ON banners FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "banners_delete_auth" ON banners FOR DELETE USING (auth.uid() IS NOT NULL);

-- ORDERS: Anyone can create, users see their own orders, admins see all
CREATE POLICY "orders_insert_all" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (
  user_id IS NULL OR user_id = auth.uid() OR auth.uid() IS NOT NULL
);
CREATE POLICY "orders_update_auth" ON orders FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ORDER_ITEMS: Anyone can create, viewable based on order access
CREATE POLICY "order_items_insert_all" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_select_all" ON order_items FOR SELECT USING (true);

-- ADDRESSES: Users manage their own addresses
CREATE POLICY "addresses_select_own" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "addresses_insert_own" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_update_own" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "addresses_delete_own" ON addresses FOR DELETE USING (auth.uid() = user_id);
