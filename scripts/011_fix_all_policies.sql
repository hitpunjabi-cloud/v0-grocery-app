-- Fix all RLS policies to avoid recursion and ensure proper access

-- 1. Fix banners admin policy - use a function to avoid recursion
DROP POLICY IF EXISTS "Banners are editable by admins" ON banners;

-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Recreate banner admin policy using the function
CREATE POLICY "Banners are editable by admins" ON banners FOR ALL USING (
  is_admin() OR auth.jwt() ->> 'role' = 'service_role'
);

-- 2. Fix profiles policy to avoid recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  auth.uid() = id
);

-- 3. Fix products admin policy
DROP POLICY IF EXISTS "Products are editable by admins" ON products;
CREATE POLICY "Products are editable by admins" ON products FOR ALL USING (
  is_admin() OR auth.jwt() ->> 'role' = 'service_role'
);

-- 4. Fix categories admin policy
DROP POLICY IF EXISTS "Categories are editable by admins" ON categories;
CREATE POLICY "Categories are editable by admins" ON categories FOR ALL USING (
  is_admin() OR auth.jwt() ->> 'role' = 'service_role'
);

-- 5. Fix orders admin policy
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (
  is_admin() OR auth.jwt() ->> 'role' = 'service_role'
);

DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE USING (
  is_admin() OR auth.jwt() ->> 'role' = 'service_role'
);

-- 6. Fix order_items admin policy
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (
  is_admin() OR auth.jwt() ->> 'role' = 'service_role'
);
