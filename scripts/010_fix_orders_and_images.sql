-- Add missing columns to orders table for guest checkout
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone text;

-- Update banner images with real grocery images
UPDATE banners SET image_url = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=600&fit=crop' 
WHERE title = 'Fresh Groceries Delivered';

UPDATE banners SET image_url = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1400&h=600&fit=crop' 
WHERE title = 'Summer Sale';

UPDATE banners SET image_url = 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&h=600&fit=crop' 
WHERE title = 'Organic & Natural';

UPDATE banners SET image_url = 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1400&h=600&fit=crop' 
WHERE title = 'Dairy & Breakfast';

-- Update product images with real product images
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop' 
WHERE name ILIKE '%banana%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop' 
WHERE name ILIKE '%apple%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop' 
WHERE name ILIKE '%milk%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop' 
WHERE name ILIKE '%egg%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=400&fit=crop' 
WHERE name ILIKE '%chicken%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop' 
WHERE name ILIKE '%bread%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop' 
WHERE name ILIKE '%juice%' OR name ILIKE '%orange%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop' 
WHERE name ILIKE '%water%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=400&fit=crop' 
WHERE name ILIKE '%cheese%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=400&fit=crop' 
WHERE name ILIKE '%butter%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=400&fit=crop' 
WHERE name ILIKE '%beef%' OR name ILIKE '%meat%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop' 
WHERE name ILIKE '%fish%' OR name ILIKE '%salmon%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=400&h=400&fit=crop' 
WHERE name ILIKE '%tomato%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop' 
WHERE name ILIKE '%carrot%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1518977676601-b53f82ber46a?w=400&h=400&fit=crop' 
WHERE name ILIKE '%potato%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1557844352-761f2565b576?w=400&h=400&fit=crop' 
WHERE name ILIKE '%mango%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1449339916-5ea5b914b4cf?w=400&h=400&fit=crop' 
WHERE name ILIKE '%strawberr%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop' 
WHERE name ILIKE '%pineapple%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=400&h=400&fit=crop' 
WHERE name ILIKE '%yogurt%' OR name ILIKE '%yoghurt%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop' 
WHERE name ILIKE '%croissant%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop' 
WHERE name ILIKE '%cake%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop' 
WHERE name ILIKE '%cola%' OR name ILIKE '%soda%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop' 
WHERE name ILIKE '%lamb%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=400&h=400&fit=crop' 
WHERE name ILIKE '%lettuce%' OR name ILIKE '%salad%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop' 
WHERE name ILIKE '%onion%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=400&fit=crop' 
WHERE name ILIKE '%cucumber%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1587411768638-ec71f8e33b78?w=400&h=400&fit=crop' 
WHERE name ILIKE '%lemon%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=400&fit=crop' 
WHERE name ILIKE '%grape%';

-- Update category images
UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&h=300&fit=crop' 
WHERE slug = 'fruits-vegetables';

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&h=300&fit=crop' 
WHERE slug = 'dairy-eggs';

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&h=300&fit=crop' 
WHERE slug = 'meat-poultry';

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop' 
WHERE slug = 'bakery';

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300&h=300&fit=crop' 
WHERE slug = 'beverages';

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=300&fit=crop' 
WHERE slug = 'snacks';

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=300&h=300&fit=crop' 
WHERE slug = 'frozen-foods';

UPDATE categories SET image_url = 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&h=300&fit=crop' 
WHERE slug = 'household';

-- Set a default image for any products without images
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop' 
WHERE image_url IS NULL OR image_url = '' OR image_url LIKE '%placeholder%';
