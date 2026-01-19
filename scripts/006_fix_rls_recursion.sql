-- Fix infinite recursion in profiles RLS policy
-- Drop the problematic policy that queries profiles from within profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new policy that uses auth.uid() directly without recursion
-- Admins can be identified by checking user metadata or we allow service role
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  auth.uid() = id OR 
  auth.jwt() ->> 'role' = 'service_role' OR
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Also fix the categories admin policy to avoid similar issues
DROP POLICY IF EXISTS "Categories are editable by admins" ON categories;
CREATE POLICY "Categories are editable by admins" ON categories FOR ALL USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Fix products admin policy
DROP POLICY IF EXISTS "Products are editable by admins" ON products;
CREATE POLICY "Products are editable by admins" ON products FOR ALL USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Fix orders admin policy
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'rider')
);

DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'rider')
);

-- Fix order_items admin policy
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (
  auth.jwt() ->> 'role' = 'service_role' OR
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'rider')
);
